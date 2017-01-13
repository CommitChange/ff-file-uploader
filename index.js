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

const isType = type => file => file.type.split('/')[0] === type 

const readImage = state => file => {
  const reader = new FileReader
  reader.onload = ev => {state.image$(ev.target.result)}
  reader.readAsDataURL(file)
}

const readText = state => file => {
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
}

const handleFile = (state, file) => {
  if(!file) return
  let type = R.last(file.type.split('/'))

  // checks file type against whitelisted file types 
  if(!R.contains(type, state.fileTypes)) {
    let fileTypeError = `${type.toUpperCase()} files cannot be uploaded`
    state.error$(fileTypeError)
    throw fileTypeError
  }
  // checks file size against maxKB 
  if(state.maxKB && file.size > state.maxKB * 1000) {
    let fileSizeError = `File size must not exceed ${state.maxKB} KB`
    state.error$(fileSizeError)
    throw fileSizeError
  }
  state.error$(false)
  state.file$(file)
}


const drag = obj => {
  return h('div'
   , {
      attrs: {'data-ff-file-uploader': ''}
    , on: {
        dragover: e => e.preventDefault()
      , drop: handleDrop(obj.state)
      }
     }
  , [obj.message || 'Upload'])
}

const input = obj => {
  return h('input'
   , {
      props: {type: 'file'}
    , attrs: {'data-ff-file-uploader': ''}
    , on: {change: handleChange(obj.state) }
    }
  , [obj.message || 'Upload'])
}

const view = obj => {
  if(obj.UI === 'input') { return input(obj) }
  return drag(obj)
}

module.exports = {view, init} 

