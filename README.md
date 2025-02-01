# SVG Library Viewer

A way for me to view large libraries of SVGs without using a service like IconJar/Iconset.

## Basic usage

`make start`

## Adding SVG(s)

1. Drop new SVG(s) in `./svg-icon-server/icons`
2. Inside `./svg-icon-server` run `node generate-svg-json.js`
3. In `./svg-icon-server/server.js` update the `jsonPath` variable to the newly generated file name. (`<date>_svgs.json`).