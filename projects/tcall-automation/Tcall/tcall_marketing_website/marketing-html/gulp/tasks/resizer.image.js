const gulpConfig = require('../gulp.config.js');
const gulp = require("gulp");
const rename = require('gulp-rename');
const resizer = require('gulp-images-resizer');
const imageResizerPath = gulpConfig.config.imageResizer.image;

function imageResizer() {
    return gulp.src(imageResizerPath.src)
      .pipe(resizer({
        format: "",
        width: 20,
      }))  
      .pipe(rename({ suffix: '-small' }))
      .pipe(gulp.dest(imageResizerPath.dest))
      
  }
  module.exports = {
	task: imageResizer
}