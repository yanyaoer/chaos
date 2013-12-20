#!/usr/bin/env python
import os
import json
import hashlib
import datetime
import tornado.web
import tornado.auth
import tornado.gen
import tornado.ioloop
import tornado.httpserver
from tornado.options import define, options, parse_command_line
import pymongo
from bson.objectid import ObjectId
from pyjade.ext.tornado import patch_tornado
patch_tornado()

define("port", 8080)
define("debug", True)
parse_command_line()
db = pymongo.Connection()['chaos']


class Application(tornado.web.Application):

  def __init__(self):
    tornado.web.Application.__init__(self, [
      (r"/login/", login),
      (r"/write/", write),
      (r"/avatar/", avatar),
      (r"/article/", article),
      (r"/api/(.*)", api),
      (r"/(home/)?", home)],
      static_path=os.path.join(os.path.dirname(__file__), "static"),
      template_path=os.path.join(os.path.dirname(__file__), "tpl"),
      cookie_secret='+/2O1qPPSqm8RHh5TgZ3o9Tt+gpjJkIsi4K/BC4pHNw=',
      debug=options.debug,
      gzip=True,
    )


class base(tornado.web.RequestHandler):

  def get_login_url(self):
    return '/login/'

  def get_current_user(self):
    return self.get_secure_cookie('token')

  def json(self, obj):
    def type_handler(obj):
      if isinstance(obj, datetime.datetime):
        return obj.isoformat()
      elif isinstance(obj, ObjectId):
        return str(obj)
    self.finish(json.dumps(obj, default=type_handler))

  def avatar(self, email=''):
    if not email:
      email = self.get_current_user()
    size = self.get_argument('s', '40')
    return "http://9429127371.a.uxengine.net/avatar/%s?s=%s" % (hashlib.md5(email.lower()).hexdigest(), size)


class dispacth(base):

  @tornado.web.asynchronous
  @tornado.gen.coroutine
  def prepare(self):
    act = "_" + self.request.uri.split('?')[0].split('/')[2]
    res = getattr(self, act, self.not_found)()
    self.json(res)

  def not_found(self):
    raise tornado.web.HTTPError(404)

  def post(self, *args):
    pass

  def get(self, *args):
    pass


class home(base):

  @tornado.web.asynchronous
  @tornado.web.authenticated
  def get(self, act=''):
    d = {'all': {},
        'my': {'user': self.get_current_user()}}
    k = self.get_argument('u', 'my')
    query = d.get(k, {'user': k})
    self.render('home.jade', article = list(db.article.find(query)))


class avatar(base):

  def get(self):
    self.redirect(self.avatar(self.get_argument('mail', '')))


class article(base):

  @tornado.web.asynchronous
  @tornado.web.authenticated
  def get(self):
    query = {'_id': ObjectId(self.get_argument('id'))}
    self.json(db.article.find_one(query))

  @tornado.web.asynchronous
  @tornado.web.authenticated
  def post(self):
    _id = self.get_argument('id')
    query = {'_id': ObjectId(_id)}
    article = db.article.find_one(query)
    if self.get_current_user() != article['user']:
      return self.json({'error': 'can not edit this post'})

    tag_list = self.get_argument('tag', '').split(',')
    update = {'content': self.get_argument('content', ''),
        'tag': map(lambda x: x.strip(), tag_list)}
    for arg in ['content', 'tags', 'title']:
      if self.get_argument(arg, None):
        update[arg] = self.get_argument(arg)

    db.article.update(query, {'$set': update}, safe=True)
    self.finish(_id)


class write(base):

  @tornado.web.asynchronous
  @tornado.web.authenticated
  def get(self):
    self.render('write.jade')

  @tornado.web.asynchronous
  @tornado.web.authenticated
  def post(self):
    res = db.article.insert(dict(
      title=self.get_argument('title'),
      content=self.get_argument('content'),
      user=self.get_current_user()))
    self.finish(str(res))


class login(base, tornado.auth.GoogleMixin):

  @tornado.web.asynchronous
  @tornado.gen.coroutine
  def get(self):
    if self.get_argument("openid.mode", None):
      user = yield self.get_authenticated_user()
      if not db.user.find({'email': user['email']}).count():
        db.user.insert(user)
      self.set_secure_cookie("token", user['email'])
      self.redirect(self.get_argument('next', '/'))
    else:
      yield self.authenticate_redirect()


class api(dispacth):

  def _fetch(self):
    u = {'user': self.get_current_user()}
    d = {'all': {}, 'my': u}
    k = self.get_argument('u', 'my')
    query = d.get(k, {'user': k})
    return {'user':u['user'], 'res': list(db.article.find(query))}


if __name__ == "__main__":
  Application().listen(options.port)
  tornado.ioloop.IOLoop.instance().start()
