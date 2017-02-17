import R from 'ramda'
import flyd from 'flyd'
import flyd_filter from 'flyd/module/filter'
import h from 'snabbdom/h'

const init = config => {
  let state = R.merge({fileTypes: [], maxKB: undefined} , config)
  state.error$ = flyd.stream()
  state.file$ = flyd.stream()
  const imageFile$ = flyd_filter(isType('image'), state.file$)
  const textFile$ = flyd_filter(isType('text'), state.file$)
  state.image$ = flyd.map(readImage(state), imageFile$) 
  state.text$ = flyd.map(readText(state), textFile$) 
  return state
}

const isType = type => file => file && file.type.split('/')[0] === type 

const readImage = state => file => {
  state.text$(undefined)
  const reader = new FileReader
  reader.onload = ev => {state.image$(ev.target.result)}
  reader.readAsDataURL(file)
}

const readText = state => file => {
  state.image$(undefined)
  const reader = new FileReader
  reader.onload = ev => {state.text$(ev.target.result)}
  reader.readAsText(file)
}

const handleDrop = state => e => {
  e.preventDefault()
  handleFile(state, e.dataTransfer.files[0])
}

const handleChange = state => e => {
  e.preventDefault()
  handleFile(state, e.target.files[0])
  e.target.value = ''
}


const error = (state, msg) => {
  state.file$(undefined)
  state.image$(undefined)
  state.text$(undefined)
  state.error$(msg)
  throw msg
}

const handleFile = (state, file) => {
  if(!file) return
  let type = R.last(file.type.split('/'))

  // checks file type against whitelisted file types 
  if(!R.contains(type, state.fileTypes)) {
    let fileTypeError = `${type.toUpperCase()} files cannot be uploaded`
    error(state, fileTypeError)
    return
  }
  // checks file size against maxKB 
  if(state.maxKB && file.size > state.maxKB * 1000) {
    let fileSizeError = `File size must not exceed ${KBMB(state.maxKB)}`
    error(state, fileSizeError)
    return
  }
  state.error$(undefined)
  state.file$(file)
}

const KBMB = KB => {
  if(KB >= 1000) return KB / 1000 + ' MB'
  return KB + ' KB'
}

const supportsTouch = () => 'ontouchstart' in document.documentElement

const clickView = obj =>
  h('div', {attrs: {'data-ff-file-uploader-click-content': ''}}
  , [
      h('input', { props: {type: 'file'}
      , attrs: {'data-ff-file-uploader-input': ''}
      , on: {change: handleChange(obj.state) }})
    , obj.clickContent || 'Select file' 
  ])

const dragView = obj => 
  h('div', {
    attrs: {'data-ff-file-uploader': ''}
  , on: {
      dragover: e => e.preventDefault()
    , drop: handleDrop(obj.state)} }
  , [
    h('div', {attrs: {'data-ff-file-uploader-drag-content': ''}}
     , [obj.dragContent || 'Drag a file to upload'])
  , clickView(obj)
   ]
  )

const view = obj => {
  if(supportsTouch() || obj.noDrag)  return clickView(obj)
  return dragView(obj)
}

module.exports = {view, init} 

