const gulpConfig = require('../gulp.config.js');
const gulp = require("gulp");
const imageMin = require('gulp-imagemin');
const imageMinPath = gulpConfig.config.imageWebp.image;

function imageMinify() {
    return gulp.src(imageMinPath.src)
      .pipe(imageMin())  
      .pipe(gulp.dest(imageMinPath.dest))
      
  }
  module.exports = {
	task: imageMinify
}