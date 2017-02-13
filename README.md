# ff-file-uploader

Features:
  - whitelist file types
  - set a max file size
  - drag and drop
  - overrides default `<input type='file'>` styles
  - returns the following streams: 
    - file$
    - error$ (based on whitelisted file types and max file size)
    - image$ (if file type is image)
    - text$ (if file type is text)
    
Demo: https://flimflamjs.github.io/ff-file-uploader/


Usage:

```es6
import uploader from 'ff-image-uploader'

const init = () => {
  let state = {}
  state.uploader = uploader.init({fileTypes: ['jpeg', 'png', 'plain'], maxKB: 2000})
  return state
}

const view = state =>
  h('div'
  , [
      uploader.view({
        messageText: 'Upload a large photo of a dog' // optional
      , inputText: 'Click here' // optional 
      , state: state.uploader
      })
    ]  
  )
```




