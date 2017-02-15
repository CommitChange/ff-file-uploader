import R from 'ramda'
import flyd from 'flyd'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import render from 'ff-core/render'

import uploader from './index.js'

const init = () => {
  let state = {}
  state.uploader = uploader.init({fileTypes: ['jpeg', 'png', 'plain'], maxKB: 2000})
  return state
}

const message = 'For this demo, you can upload the following file types: jpg, png, txt' 

const view = state =>
  h('div', [
      h('h2', 'ff-file-uploader')
    , h('ul', [
        h('li', 'Whitelist file types')
      , h('li', 'Set a max file size')
      , h('li', 'drag and drop')
      , h('li', "overrides default <input type='file'> style")
      , h('li', 'Returns the following streams:')
      , h('ul', [
          h('li', 'file$')
        , h('li', 'error$ (based on whitelisted file types and max file size)')
        , h('li', 'image$ (if file type is image)')
        , h('li', 'text$ (if file type is text)')
        ])
      ])
    , h('hr')
    , h('p', message)
    , uploader.view({
        noDrag: true
      , dragContent: h('h1', 'asdf') 
      , clickContent: h('button', 'click me') 
      , state: state.uploader
      })
    , h('p.error', state.uploader.error$())
    , state.uploader.file$()
      ? h('p', state.uploader.file$().name + ' (' + state.uploader.file$().size / 1000 + ' KB)')
      : ''
    , state.uploader.image$()
      ? h('img.image-preview', {
            props: {src: state.uploader.image$()}
          })
      : ''
    , state.uploader.text$()
      ? h('p', {
          props: {innerHTML: state.uploader.text$()}
        })
      : ''
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

