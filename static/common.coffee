moment = require("moment")
$ = require("jquery")

#for el in document.querySelectorAll('.time')
  #el.innerText = moment(el.innerText).fromNow()


window.get_timestamp_by_object_id = (oid)->
  #[ref]:https://github.com/justaprogrammer/ObjectId.js/blob/master/src/main/javascript/Objectid.js#L55
  return Number('0x' + oid.substr(0, 8))*1000

$ ->
  el = $('#loading')
  $(document)
    .ajaxStart ()->
      el.show()
    .ajaxComplete ()->
      el.hide()


  processFiles = (event) ->
    event.stopPropagation()
    event.preventDefault()
    console.log event

    # FileList object of File objects
    files = event.dataTransfer.files
    i = 0
    f = undefined

    while f = files[i]
      reader = new FileReader()

      # closure to capture file info
      reader.onload = ((file, index) ->
        (e) ->
          dataUri = e.target.result
          if file.type.match("image.*")
            img = document.createElement('IMG')
            img.setAttribute('src', dataUri)
            img.setAttribute('title', file.name)
            sel = document.getSeletion()
            console.log sel,img
            if sel.type is 'None'
              document.queryselector('.article-conent').appendChild(img)
            else
              sel.getRangeAt(0).insertNode(img)
      )(f, i)
      i++

  dropZone = document.getElementById("feed")
  # add event listeners if File API is supported
  console.log dropZone, '==='
  dropfn = (e)->
    e.stopPropagation()
    e.preventDefault()
    console.log e
  if window.File and window.FileReader and window.FileList and window.Blob
    dropZone.addEventListener "drop", dropfn, false
    console.log 'init'
    #$('#feed').on 'drop', processFiles
    dropZone.addEventListener "dragenter", dropfn, false
    #dropZone.addEventListener "dragover", highlightDropZone, false
    #dropZone.addEventListener "dragleave", removeDropZoneClass, false
  else
    console.log "The File APIs are not fully supported in this browser."
