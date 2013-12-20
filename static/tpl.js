
jade = (function(exports){
/*!
 * Jade - runtime
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Lame Array.isArray() polyfill for now.
 */

if (!Array.isArray) {
  Array.isArray = function(arr){
    return '[object Array]' == Object.prototype.toString.call(arr);
  };
}

/**
 * Lame Object.keys() polyfill for now.
 */

if (!Object.keys) {
  Object.keys = function(obj){
    var arr = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        arr.push(key);
      }
    }
    return arr;
  }
}

/**
 * Merge two attribute objects giving precedence
 * to values in object `b`. Classes are special-cased
 * allowing for arrays and merging/joining appropriately
 * resulting in a string.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api private
 */

exports.merge = function merge(a, b) {
  var ac = a['class'];
  var bc = b['class'];

  if (ac || bc) {
    ac = ac || [];
    bc = bc || [];
    if (!Array.isArray(ac)) ac = [ac];
    if (!Array.isArray(bc)) bc = [bc];
    ac = ac.filter(nulls);
    bc = bc.filter(nulls);
    a['class'] = ac.concat(bc).join(' ');
  }

  for (var key in b) {
    if (key != 'class') {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * Filter null `val`s.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function nulls(val) {
  return val != null;
}

/**
 * Render the given attributes object.
 *
 * @param {Object} obj
 * @param {Object} escaped
 * @return {String}
 * @api private
 */

exports.attrs = function attrs(obj, escaped){
  var buf = []
    , terse = obj.terse;

  delete obj.terse;
  var keys = Object.keys(obj)
    , len = keys.length;

  if (len) {
    buf.push('');
    for (var i = 0; i < len; ++i) {
      var key = keys[i]
        , val = obj[key];

      if ('boolean' == typeof val || null == val) {
        if (val) {
          terse
            ? buf.push(key)
            : buf.push(key + '="' + key + '"');
        }
      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
        buf.push(key + "='" + JSON.stringify(val) + "'");
      } else if ('class' == key && Array.isArray(val)) {
        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
      } else if (escaped && escaped[key]) {
        buf.push(key + '="' + exports.escape(val) + '"');
      } else {
        buf.push(key + '="' + val + '"');
      }
    }
  }

  return buf.join(' ');
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function escape(html){
  return String(html)
    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

/**
 * Re-throw the given `err` in context to the
 * the jade in `filename` at the given `lineno`.
 *
 * @param {Error} err
 * @param {String} filename
 * @param {String} lineno
 * @api private
 */

exports.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = require('fs').readFileSync(filename, 'utf8')
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

  return exports;

})({});

jade.templates = {};
jade.render = function(node, template, data) {
  var tmp = jade.templates[template](data);
  node.innerHTML = tmp;
};

jade.templates["nav"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
// iterate nav
;(function(){
  if ('number' == typeof nav.length) {
    for (var i = 0, $$l = nav.length; i < $$l; i++) {
      var x = nav[i];

buf.push('<a');
buf.push(attrs({ 'idx':(i), '_id':(x._id), 'href':("#/article/?id=" + (x._id) + ""), "class": ('item') }, {"idx":true,"_id":true,"href":true}));
buf.push('>');
 var ts = get_timestamp_by_object_id(x._id)
buf.push('<div');
buf.push(attrs({ 'href':("#/?u=" + (x.user) + ""), "class": ('left') + ' ' + ('floated') + ' ' + ('ui') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/avatar/?mail=" + (x.user) + ""), 'title':(x.user), 'data-conten':(x.user), "class": ('ui') + ' ' + ('circular') + ' ' + ('image') + ' ' + ('avatar') }, {"src":true,"title":true,"data-conten":true}));
buf.push('/></div><div class="description">');
var __val__ = x.title 
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><time');
buf.push(attrs({ 'ts':(ts), "class": ('date') }, {"ts":true}));
buf.push('>');
var __val__ = ts 
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</time></a>');
    }
  } else {
    for (var i in nav) {
      var x = nav[i];

buf.push('<a');
buf.push(attrs({ 'idx':(i), '_id':(x._id), 'href':("#/article/?id=" + (x._id) + ""), "class": ('item') }, {"idx":true,"_id":true,"href":true}));
buf.push('>');
 var ts = get_timestamp_by_object_id(x._id)
buf.push('<div');
buf.push(attrs({ 'href':("#/?u=" + (x.user) + ""), "class": ('left') + ' ' + ('floated') + ' ' + ('ui') }, {"href":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/avatar/?mail=" + (x.user) + ""), 'title':(x.user), 'data-conten':(x.user), "class": ('ui') + ' ' + ('circular') + ' ' + ('image') + ' ' + ('avatar') }, {"src":true,"title":true,"data-conten":true}));
buf.push('/></div><div class="description">');
var __val__ = x.title 
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</div><time');
buf.push(attrs({ 'ts':(ts), "class": ('date') }, {"ts":true}));
buf.push('>');
var __val__ = ts 
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</time></a>');
   }
  }
}).call(this);

}
return buf.join("");
}
jade.templates["page"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="ui field">');
if ( _is_owner())
{
buf.push('<div class="ui fluid icon input"><input');
buf.push(attrs({ 'type':("text"), 'name':("title"), 'value':(title), 'placeholder':("title..."), "class": ('article-title') }, {"type":true,"name":true,"value":true,"placeholder":true}));
buf.push('/><i class="file icon"></i></div>');
}
else
{
buf.push('<h1 class="ui header">');
var __val__ = title
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</h1><div class="ui divider"></div>');
}
buf.push('</div><div class="ui field">');
if ( _is_owner())
{
buf.push('<div class="ui segment stacked labeled icon input"><div class="article-content"></div><i class="edit icon"></i></div>');
}
else
{
buf.push('<div class="article-content ui"></div>');
}
buf.push('</div><div class="article-extra field">');
if ( _is_owner())
{
buf.push('<div class="ui fluid icon input"><input');
buf.push(attrs({ 'type':("text"), 'name':("tag"), 'value':(tag.join(',')), 'placeholder':("tag1, tag2..."), "class": ('article-tag') }, {"type":true,"name":true,"value":true,"placeholder":true}));
buf.push('/><i class="tags icon"></i></div>');
}
else
{
buf.push('<div class="ui labeled icon teal label"><i class="tags icon"></i>tags</div>');
// iterate tag
;(function(){
  if ('number' == typeof tag.length) {
    for (var $index = 0, $$l = tag.length; $index < $$l; $index++) {
      var t = tag[$index];

buf.push('<span class="ui label">');
var __val__ = t
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
    }
  } else {
    for (var $index in tag) {
      var t = tag[$index];

buf.push('<span class="ui label">');
var __val__ = t
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>');
   }
  }
}).call(this);

}
buf.push('<div class="ui list left floated"><div class="ui purple horizontal label"><i class="users icon"></i>Contributor</div><a');
buf.push(attrs({ 'href':("/?u=" + (user) + ""), 'data-content':(user), 'data-position':('top right'), "class": ('ui') + ' ' + ('circular') + ' ' + ('image') + ' ' + ('avatar') }, {"href":true,"data-content":true,"data-position":true}));
buf.push('><img');
buf.push(attrs({ 'src':("/avatar/?mail=" + (user) + "&s=27"), 'title':(user) }, {"src":true,"title":true}));
buf.push('/></a></div></div>');
}
return buf.join("");
}
jade.templates["write"] = function(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="ui field"><div class="ui fluid icon input"><input type="text" name="title" placeholder="title..." class="article-title"/><i class="file icon"></i></div></div><div class="ui field"><div class="ui segment stacked labeled icon input"><div class="article-content"></div><i class="edit icon"></i></div></div><div class="article-extra field"><div class="ui fluid icon input"><input type="text" name="tag" placeholder="tag1, tag2..." class="article-tag"/><i class="tags icon"></i></div></div>');
}
return buf.join("");
}