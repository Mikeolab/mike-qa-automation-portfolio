const gulpConfig = require('../gulp.config.js');
const del = require("del");

const path = gulpConfig.path;
const scss = gulpConfig.config.scss;
const js = gulpConfig.config.js;

function cleanCSS() {
	return del([path.map, path.css]);
}

function cleanCompiled() {
	return del([scss.theme.name, js.vendor.dest, js.block.dest, scss.critical.dest, path.map]);
}

module.exports = {
	compiled: cleanCompiled,
	clean: cleanCSS,
}