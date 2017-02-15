# ff-file-uploader

Features:
  - whitelist file types
  - set a max file size
  - drag and drop
  - hides drag and drop UI on mobile
  - overrides default `<input type='file'>` styles
  - returns the following streams: 
    - file$
    - error$ (based on whitelisted file types and max file size)
    - image$ (if file type is image)
    - text$ (if file type is text)
    
Demo: https://flimflamjs.github.io/ff-file-uploader/

Usage:

```javascript
const uploader = require('ff-image-uploader')

const init = () => {
  let state = {}
  state.uploader = uploader.init({fileTypes: ['jpeg', 'png', 'plain'], maxKB: 2000})
  return state
}

const view = state =>
  h('div'
  , [
      uploader.view({
        noDrag: true // optional - hides drag and drop UI
      , dragContent: h('h3', 'Drag to upload a file...') // optional
      , clickContent: h('button', 'or browse...') // optional
      , state: state.uploader
      })
    ]  
  )
```




