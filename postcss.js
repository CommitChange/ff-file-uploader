module.exports = {
  use: [
    'postcss-import'
  , 'autoprefixer'
  , 'cssnano']
, 'local-plugins' : true
, 'autoprefixer' : {browsers: 'last 2 versions'}
, input: 'page.css'
, output: 'build.css'
}

