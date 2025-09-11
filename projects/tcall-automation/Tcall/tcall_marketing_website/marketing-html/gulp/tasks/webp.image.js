const gulpConfig = require('../gulp.config.js');
const gulp = require("gulp");
const webp = require('gulp-webp');
const imageWebpPath = gulpConfig.config.imageWebp.image;

function imageWebp() {
    return gulp.src(imageWebpPath.src)
      .pipe(webp())  
      .pipe(gulp.dest(imageWebpPath.dest))
      
  }
  module.exports = {
	task: imageWebp
}