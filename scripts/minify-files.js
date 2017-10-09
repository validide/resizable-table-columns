const minifier = require("minifier");
const options = {};
const pathsToMinify = [
  "./dist/css",
  "./dist/js"
];

minifier.on("error", function(err) {
	console.error(err);
});

for(let i=0; i< pathsToMinify.length; i++) {
  minifier.minify(pathsToMinify[i]);
}

console.log("Done minfying!");
