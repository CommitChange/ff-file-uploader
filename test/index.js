const test = require('tape')
const R = require("ramda")
const flyd = require("flyd")
const render = require('flimflam-render')

const uploader = require('../index.js')

function init(obj) {
  const container = document.createElement('div')
  const options = obj.options 
    ? obj.options
    : {fileTypes: ['jpeg', 'png', 'plain'], maxKB: 2000}

  const state = uploader.init(options)

  const view = state => 
    uploader.view({
      dragContent:  'drag content'
    , clickContent:  'click content'
    , state
    })

  let streams = render(view, state, container)
  streams.state = state
  streams.container = container
  return streams
}

test('drag content gets set', t => {
  t.plan(1)
  const streams = init({})
  t.equal(streams.dom$().querySelector('[data-ff-file-uploader-drag-content]').textContent, 'drag content')
})

test('click content gets set', t => {
  t.plan(1)
  const streams = init({})
  t.equal(streams.dom$().querySelector('[data-ff-file-uploader-click-content]').textContent, 'click content')
})

