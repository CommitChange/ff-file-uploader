'use strict';

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _flyd = require('flyd');

var _flyd2 = _interopRequireDefault(_flyd);

var _filter = require('flyd/module/filter');

var _filter2 = _interopRequireDefault(_filter);

var _h = require('snabbdom/h');

var _h2 = _interopRequireDefault(_h);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = function init(config) {
  var state = _ramda2.default.merge({ fileTypes: [], maxKB: undefined }, config);
  state.error$ = _flyd2.default.stream();
  state.file$ = _flyd2.default.stream();
  var imageFile$ = (0, _filter2.default)(isType('image'), state.file$);
  var textFile$ = (0, _filter2.default)(isType('text'), state.file$);
  state.image$ = _flyd2.default.map(readImage(state), imageFile$);
  state.text$ = _flyd2.default.map(readText(state), textFile$);
  return state;
};

var isType = function isType(type) {
  return function (file) {
    return file && file.type.split('/')[0] === type;
  };
};

var readImage = function readImage(state) {
  return function (file) {
    state.text$(undefined);
    var reader = new FileReader();
    reader.onload = function (ev) {
      state.image$(ev.target.result);
    };
    reader.readAsDataURL(file);
  };
};

var readText = function readText(state) {
  return function (file) {
    state.image$(undefined);
    var reader = new FileReader();
    reader.onload = function (ev) {
      state.text$(ev.target.result);
    };
    reader.readAsText(file);
  };
};

var handleDrop = function handleDrop(state) {
  return function (e) {
    e.preventDefault();
    handleFile(state, e.dataTransfer.files[0]);
  };
};

var handleChange = function handleChange(state) {
  return function (e) {
    e.preventDefault();
    handleFile(state, e.target.files[0]);
    e.target.value = '';
  };
};

var error = function error(state, msg) {
  state.file$(undefined);
  state.image$(undefined);
  state.text$(undefined);
  state.error$(msg);
  throw msg;
};

var handleFile = function handleFile(state, file) {
  if (!file) return;
  var type = _ramda2.default.last(file.type.split('/'));

  // checks file type against whitelisted file types 
  if (!_ramda2.default.contains(type, state.fileTypes)) {
    var fileTypeError = type.toUpperCase() + ' files cannot be uploaded';
    error(state, fileTypeError);
    return;
  }
  // checks file size against maxKB 
  if (state.maxKB && file.size > state.maxKB * 1000) {
    var fileSizeError = 'File size must not exceed ' + KBMB(state.maxKB);
    error(state, fileSizeError);
    return;
  }
  state.error$(undefined);
  state.file$(file);
};

var KBMB = function KBMB(KB) {
  if (KB >= 1000) return KB / 1000 + ' MB';
  return KB + ' KB';
};

var supportsTouch = function supportsTouch() {
  return 'ontouchstart' in document.documentElement;
};

var clickView = function clickView(obj) {
  return (0, _h2.default)('div', { attrs: { 'data-ff-file-uploader-click-content': '' } }, [(0, _h2.default)('input', { props: { type: 'file' },
    attrs: { 'data-ff-file-uploader-input': '' },
    on: { change: handleChange(obj.state) } }), obj.clickContent || 'Select file']);
};

var dragView = function dragView(obj) {
  return (0, _h2.default)('div', {
    attrs: { 'data-ff-file-uploader': '' },
    on: {
      dragover: function dragover(e) {
        return e.preventDefault();
      },
      drop: handleDrop(obj.state) } }, [(0, _h2.default)('div', { attrs: { 'data-ff-file-uploader-drag-content': '' } }, [obj.dragContent || 'Drag a file to upload']), clickView(obj)]);
};

var view = function view(obj) {
  if (supportsTouch() || obj.noDrag) return clickView(obj);
  return dragView(obj);
};

module.exports = { view: view, init: init };
