import R from 'ramda'
import flyd from 'flyd'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import render from 'ff-core/render'

import uploader from './index.js'

const init = () => {
  let state = {}
  state.uploader = uploader.init({fileTypes: ['jpeg'], maxKB: 270})
  flyd.map(x => console.log(x), state.uploader.error$) 
  return state
}


const view = state =>
  h('div', [
      h('h2', 'Upload your file below')
    , uploader.view({state: state.uploader})
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

