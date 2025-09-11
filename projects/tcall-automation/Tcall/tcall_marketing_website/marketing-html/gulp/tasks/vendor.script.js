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
const vendor = gulpConfig.config.js.vendor;

function vendorScripts() {

	if (environment === 'production') {
		return gulp
			.src(vendor.src)
			.pipe(gulpPlumber({
				errorHandler: console.error
			}))
			.pipe(gulpBabel({
				presets: ['@babel/preset-env']
			}))
			.pipe(gulpUglify({
				output: {
					comments: "/^!/"
				}
			}))
			.pipe(gulp.dest(vendor.dest))
			.on('end', () => {
				fancyLog(`Production build task for Vendor Scripts completed.`)
			});
	}
	else {
		return gulp
			.src(vendor.src)
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
			}))
			.pipe(gulpSourcemaps.write(vendor.map.path))
			.pipe(gulp.dest(vendor.dest))
			.on('end', () => {
				fancyLog(`Development build task for Vendor Scripts completed.`)
			});
	}
}

module.exports = {
	task: vendorScripts
}