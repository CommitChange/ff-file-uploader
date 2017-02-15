const test = require('tape')
const R = require("ramda")
const flyd = require("flyd")
const render = require('flimflam-render')

const uploader = require('../index.js')

function init(obj) {
  const container = document.createElement('div')
  const stateOptions = obj.stateOptions 
    ? obj.stateOptions
    : {fileTypes: ['jpeg', 'png', 'plain'], maxKB: 2000}

  const state = uploader.init(stateOptions)

  const view = state => 
    uploader.view(R.merge({
      dragContent:  'drag content'
    , clickContent:  'click content'
    , state
    }, obj.viewOptions))

  let streams = render(view, state, container)
  streams.state = state
  streams.container = container
  return streams
}

test('contents gets set', t => {
  t.plan(2)
  const streams = init({})
  t.equal(streams.dom$().querySelector('[data-ff-file-uploader-drag-content]').textContent, 'drag content')
  t.equal(streams.dom$().querySelector('[data-ff-file-uploader-click-content]').textContent, 'click content')
})

test('renders correct markup when noDrag option is set', t => {
  t.plan(2)
  const streams1 = init({viewOptions: {noDrag: true}})
  t.false(streams1.dom$().querySelector('[data-ff-file-uploader-drag-content]'))
  const streams2 = init({})
  t.true(streams2.dom$().querySelector('[data-ff-file-uploader-drag-content]'))
})

