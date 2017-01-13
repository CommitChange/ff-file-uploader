import R from 'ramda'
import flyd from 'flyd'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import render from 'ff-core/render'

import uploader from './index.js'

const init = () => {
  let state = {}
  state.uploader = uploader.init({fileTypes: ['jpeg', 'png'], maxKB: 400})
  flyd.map(x => console.log(x), state.uploader.text$) 
  return state
}

const message = 'For this demo, you can upload the following file types: jpg, png' 

const view = state =>
  h('div', [
      h('h2', 'ff-file-uploader')
    , h('ul', [
        h('li', 'Whitelist file types')
      , h('li', 'Set a max file-size')
      , h('li', 'Returns the following stream:')
      , h('li', 'Choose between standard input and drag-and-drop UIs') 
      , h('ul', [
          h('li', 'file$')
        , h('li', 'error$')
        , h('li', 'image$ (if file type is image)')
        , h('li', 'text$ (if file type is text)')
        ])
      ])
    , h('hr')
    , h('p', message)
    , uploader.view({message: 'Drag an image to upload', UI: 'drag', state: state.uploader})
    , uploader.view({UI: 'input', state: state.uploader})
    , h('p.error', state.uploader.error$())
    , h('img.image-preview', {
        props: {src: state.uploader.image$()}
      })
  ])

const patch = snabbdom.init([
  require("snabbdom/modules/class").default
, require("snabbdom/modules/style").default
, require("snabbdom/modules/props").default
, require("snabbdom/modules/eventlisteners").default
, require("snabbdom/modules/attributes").default
])

const container = document.querySelector('#container')

const state = init()

render({container, state, view, patch})

