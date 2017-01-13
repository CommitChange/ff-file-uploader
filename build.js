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
    return file.type.split('/')[0] === type;
  };
};

var readImage = function readImage(state) {
  return function (file) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      state.image$(ev.target.result);
    };
    reader.readAsDataURL(file);
  };
};

var readText = function readText(state) {
  return function (file) {
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
  };
};

var handleFile = function handleFile(state, file) {
  if (!file) return;
  var type = _ramda2.default.last(file.type.split('/'));

  // checks file type against whitelisted file types 
  if (!_ramda2.default.contains(type, state.fileTypes)) {
    var fileTypeError = type.toUpperCase() + ' files cannot be uploaded';
    state.error$(fileTypeError);
    throw fileTypeError;
  }
  // checks file size against maxKB 
  if (state.maxKB && file.size > state.maxKB * 1000) {
    var fileSizeError = 'File size must not exceed ' + state.maxKB + ' KB';
    state.error$(fileSizeError);
    throw fileSizeError;
  }
  state.error$(false);
  state.file$(file);
};

var drag = function drag(obj) {
  return (0, _h2.default)('div', {
    attrs: { 'data-ff-file-uploader': '' },
    on: {
      dragover: function dragover(e) {
        return e.preventDefault();
      },
      drop: handleDrop(obj.state)
    }
  }, [obj.message || 'Upload']);
};

var input = function input(obj) {
  return (0, _h2.default)('input', {
    props: { type: 'file' },
    attrs: { 'data-ff-file-uploader': '' },
    on: { change: handleChange(obj.state) }
  }, [obj.message || 'Upload']);
};

var view = function view(obj) {
  if (obj.UI === 'input') {
    return input(obj);
  }
  return drag(obj);
};

module.exports = { view: view, init: init };
