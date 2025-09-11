// File: gulpfile.js

// Import Gulp and plugins
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); // Use Dart Sass
const postcss = require('gulp-postcss'); // For PostCSS plugins like autoprefixer
const autoprefixer = require('autoprefixer'); // Add vendor prefixes
const cleanCSS = require('gulp-clean-css'); // Minify CSS
const rename = require('gulp-rename'); // Rename files

// Define paths
const paths = {
  scss: './src/assets/scss/**/*.scss', // Source SCSS files
  css: './src/assets/css' // Destination folder for compiled CSS
};

// SCSS Compilation Task
gulp.task('scss', function () {
  return gulp
    .src(paths.scss) // Get all SCSS files
    .pipe(sass().on('error', sass.logError)) // Compile SCSS and log errors
    .pipe(postcss([autoprefixer()])) // Add vendor prefixes
    .pipe(gulp.dest(paths.css)) // Save unminified CSS
    .pipe(cleanCSS()) // Minify CSS
    .pipe(rename({ suffix: '.min' })) // Rename to *.min.css
    .pipe(gulp.dest(paths.css)); // Save minified CSS
});

// Watch Task
gulp.task('watch', function () {
  gulp.watch(paths.scss, gulp.series('scss')); // Watch SCSS files
});

// Default Task
gulp.task('default', gulp.series('scss', 'watch'));
