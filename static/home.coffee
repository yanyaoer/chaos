Pen = require("pen")
$ = require('semantic-ui')
Q = require("q")
react = require("react")
moment = require("moment")
query = require("querystring")
#Dropzone = require("dropzone")

$ ->
  page =
    nav: $("#navigator")
    data: []
    active: {}

    fetch: ()->
      $.get('/api/fetch' + window.location.search)
      .done (e)->
        d=JSON.parse(e)
        page.data = d.res
        page.user = d.user

    bind: ()->
      window._is_owner = ()->
        return page.user == page.active.user

      react(page)
      .on 'change data', (modify, origin)->
        jade.render(page.nav[0], 'nav', {nav:page.data})
      .on 'change active', (modify, origin)->
        clearInterval(window.autosave)
        console.log page.active

        if not page.active._id
          jade.render($('.article')[0], 'write')
        else
          if 'tag' not of page.active
            page.active.tag = []
          #console.log page.active, page.active.user
          jade.render($('.article')[0], 'page', page.active)
          $('.article-content').html page.active.content

        $('.avatar').popup
          position: 'top right'

        page.nav.find('.active').removeClass('active')
        if page.active._id
          page.nav.find("[_id=#{page.active._id}]").addClass('active')

        if not page.active._id or (page.user is page.active.user)
          page.edit()

    edit: ()->
      # init edit
      field = $('.article-title, .article-content, .article-tag')
      console.log field
      new Pen
        editor: field[1]
        stay: false

      # save
      save = ()->
        uri = if page.active._id then "/article/?id=" + page.active._id else '/write/'
        tag = $('.article-tag').val()
        title = $('.article-title').val()
        content = $('.article-content').html()
        if not page.active._id or tag isnt page.active.tag.join(',') or content isnt page.active.content or title isnt page.active.title
          idx = page.data.indexOf page.active
          idx = 0 if idx < 0 # write first article
          page.active.tag = tag
          page.active.title = title
          page.active.content = content
          postdata = query.stringify page.active
          $.post uri, postdata, (res)->
            page.active._id = res
          page.active.tag = tag.split(',')
          page.data[idx] = page.active

      window.autosave = setInterval save, 15000
      field.on 'blur', save

    notify: (html, color)->
      el = $($.parseHTML("<div class='notify ui compact #{color or 'red'} message'>#{html}</div>"))
      $(document.body).append(el)
      setTimeout ()->
        el.fadeOut 1000,()->
          el.remove()
        2000

    init: ()->
      Q.fcall(page.bind)
      .then(page.fetch)
      .then(handler.router)
      .catch((err)-> console.dir err, arguments)
      .done ()->
        #related time
        for el in document.querySelectorAll('.date')
          el.innerText = moment(+el.innerText).fromNow()

        #upload file
        #new Dropzone "div#upload"


  handler =
    router: ()->
      $(window).on 'hashchange load', (e)->
        args = window.location.hash.split('/')
        console.log args
        console.log args and args[1] of handler
        if args and args[1] of handler
          arg = query.parse(args[2].replace('?', ''))
          handler[args[1]](arg)
        else
          handler.home()

    home: ()->
      page.active = page.data[0]

    compose: ()->
      page.active = {user:page.user}

    article: (arg)->
      filted = page.data.filter((d)-> return d._id is arg.id)
      if filted.length
        page.active = filted[0]
      else
        page.notify('article not found')
      #TODO fetch_article_from_remote_by_id()

  page.init()
  #handler.router()

