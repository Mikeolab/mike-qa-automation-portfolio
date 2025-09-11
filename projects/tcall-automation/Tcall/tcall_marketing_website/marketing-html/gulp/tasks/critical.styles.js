const gulpConfig = require('../gulp.config.js');
const gulp = require("gulp");
const extractCriticalCss = require('gulp-extract-critical-css');
const gulpPlumber = require('gulp-plumber');
const gulpPostcss = require("gulp-postcss");
const gulpRename = require("gulp-rename");
const gulpSass = require("gulp-sass")(require("sass")); // -- gulp-sass requires a complier "sass"
const gulpSourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const pxtorem = require('postcss-pxtorem');
const fancyLog = require('fancy-log');
const gulpMode = require('gulp-mode')({
	modes: ["production", "development"],
	default: "development",
	verbose: false
});
const environment = gulpMode.development() ? 'development' : 'production';
const path = gulpConfig.path;
const config = gulpConfig.config;
const critical = gulpConfig.config.scss.critical;


// ANCHOR Critical CSS task
function criticalStyles() {
	let outputStyle = 'expanded';
	let fileName = [];

	const rename = (path) => {
		path.basename = path.basename.substr(1)
		fileName.push(`${path.basename}.css`)
	};

	if (environment === 'production') {
		return gulp
			.src(critical.src,)
			.pipe(gulpPlumber({
				errorHandler: console.error
			}))
			.pipe(gulpRename(rename)) // Uses original file name
			.pipe(gulpSass({ outputStyle: outputStyle }))
			.pipe(gulpPostcss([autoprefixer(), cssnano(), pxtorem({ proplist: ['*'] })]))
			.pipe(gulp.dest(critical.dest))
			.on('end', () => {
				fancyLog(`Production build task for Critical CSS completed`)
				console.table(fileName)
			});
	}
	else {
		return gulp
			.src(critical.src,)
			.pipe(gulpPlumber({
				errorHandler: console.error
			}))
			.pipe(gulpRename(rename)) // Uses original file name
			.pipe(gulpSourcemaps.init({ loadMaps: true }))
			.pipe(gulpSass({ outputStyle: 'compressed' }).on("error", gulpSass.logError))
			.pipe(gulpPostcss([autoprefixer(), pxtorem({ proplist: ['*'] })]))
			// .pipe(gulpSourcemaps.write(critical.map.path))
			.pipe(gulp.dest(critical.dest))
			.pipe(extractCriticalCss({
				inlineCritical: true,
				inlinePath: "index.html"
			}))
			.on('end', () => {
				fancyLog(`Development build task for Critical CSS completed`)
				console.table(fileName)
			});
	}
}

module.exports = {
	task: criticalStyles
}