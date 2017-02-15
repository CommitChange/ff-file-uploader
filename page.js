import R from 'ramda'
import flyd from 'flyd'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import render from 'flimflam-render'

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
      , h('li', 'hides drag and drop UI on mobile')
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
        dragContent: h('h3', 'Drag to upload a file...') 
      , clickContent: h('button', 'or browse...') 
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


const container = document.querySelector('#container')

const state = init()

render(view, state, container)

