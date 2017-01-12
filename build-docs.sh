#!/bin/bash

echo "copying index.html into docs/index.html..."
cp index.html docs/index.html
echo "browserifying page.js into docs/page.js..."
browserify -v -t babelify page.js | uglifyjs > docs/page.js
echo "building page.css into build.css..."
postcss -c postcss.js -l
echo "copying build.css into docs/build.css"
cp build.css docs/build.css

