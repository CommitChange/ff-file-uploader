import R from 'ramda'
import flyd from 'flyd'
import h from 'snabbdom/h'



const init = config => {
 let state = R.merge(
    {
      fileTypes: []
    , maxKB: undefined 
    }
  , config 
  )
  
  state.error$ = flyd.stream()
  state.progress$ = flyd.stream()
  return state

}

const handleDrop = state => e => {
  e.preventDefault()
  let file = e.dataTransfer.files[0]
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
  console.log(file)

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

const button = obj => {
  return h('button', [obj.message || 'Upload'])
}


const view = obj => {
  if(obj.UI === 'button') { return button(obj) }
  return drag(obj)
}


module.exports = {view, init} 

