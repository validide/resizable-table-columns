const _fs = require('fs');
const _path = require('path');
const _glob = require('glob');
const _uglifycss = require('uglifycss');
const _uglifyJS = require("uglify-js");


function writeMinifiedFileSync(path, content, encding) {
  const file = _path.parse(path);
  const minifiedFilePath = _path.join(file.dir, `${file.name}.min${file.ext}`);
  // console.log(minifiedFilePath);
  _fs.writeFileSync(minifiedFilePath, content, encding);
}


_glob
  .sync('./dist/css/**/*.css', [])
  .forEach((f) => {
    writeMinifiedFileSync(f, _uglifycss.processFiles([f], {}), 'utf8');
    // console.log(`Minified "${f}"`);
  });


_glob
  .sync('./dist/js/bundle/**/*.js', [])
  .forEach((f) => {
    writeMinifiedFileSync(f, _uglifyJS.minify(_fs.readFileSync(f, 'utf8'), {}).code, 'utf8');
    // console.log(`Minified "${f}"`);
  });
