const gulpConfig = require('../gulp.config.js');
const gulp = require("gulp");
const gulpPlumber = require('gulp-plumber');
const gulpUglify = require('gulp-uglify');
const gulpBabel = require('gulp-babel');
const gulpSourcemaps = require('gulp-sourcemaps');
const fancyLog = require('fancy-log');
const gulpMode = require('gulp-mode')({
	modes: ["production", "development"],
	default: "development",
	verbose: false
});
const environment = gulpMode.development() ? 'development' : 'production';
const block = gulpConfig.config.js.block;


// ANCHOR Transpile, concatenate and minify theme and gutenberg block scripts
function blockScripts() {

	return gulp
		.src(block.src)
		.pipe(gulpPlumber({
			errorHandler: console.error
		}))
		.pipe(gulpSourcemaps.init({ loadMaps: true }))
		.pipe(gulpBabel({
			presets: ['@babel/preset-env']
		}))
		.pipe(gulpUglify({
			output: {
				comments: "/^!/"
			}
		}).on('error', function (e) {
			console.log(e);
		}))
		.pipe(gulpSourcemaps.write(block.map.path))
		.pipe(gulp.dest(block.dest))
		.on('end', () => {
			fancyLog(`Build task for theme Scripts completed.`)
		});
}

module.exports = {
	task: blockScripts
}