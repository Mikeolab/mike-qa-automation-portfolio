const gulpConfig = require('../gulp.config.js');
const gulp = require("gulp");
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
const theme = gulpConfig.config.scss.theme;

// ANCHOR Default CSS task
function themeStyles() {
	let outputStyle = 'expanded';

	if (environment === 'production') {
		return gulp
			.src(theme.src)
			.pipe(gulpPlumber({
				errorHandler: console.error
			}))
			.pipe(gulpSass({ outputStyle: outputStyle }))
			.pipe(gulpRename(theme.name))
			.pipe(gulpPostcss([autoprefixer(), cssnano(), pxtorem({ proplist: ['*'] })]))
			.pipe(gulp.dest(theme.dest))
			.on('end', () => {
				fancyLog(`Production build task for SCSS completed.${theme.src}`)
			});
	}
	else {
		return gulp
			.src(theme.src)
			.pipe(gulpPlumber({
				errorHandler: console.error
			}))
			.pipe(gulpSourcemaps.init({ loadMaps: true }))
			.pipe(gulpSass({ outputStyle: 'compressed' }).on("error", gulpSass.logError))
			.pipe(gulpRename(theme.name))
			.pipe(gulpPostcss([autoprefixer(), pxtorem({ proplist: ['*'] })]))
			//.pipe(gulpSourcemaps.write(theme.map.path))
			.pipe(gulpSourcemaps.write('./'))
			.pipe(gulp.dest(theme.dest))
			.on('end', () => {
				fancyLog(`Development build task for SCSS completed.${theme.src}`)
			});
	}
}

module.exports = {
	task: themeStyles
}