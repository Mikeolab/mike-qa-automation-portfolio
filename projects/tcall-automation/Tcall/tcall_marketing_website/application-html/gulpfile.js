// gulpfile.js

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
    scss: {
        src: 'assets/scss/**/*.scss',
        dest: 'assets/css'
    },
    js: {
        src: 'assets/js/**/*.js',
        dest: 'assets/js/dist'
    }
};

// Compile SCSS
function styles() {
    return gulp.src(paths.scss.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scss.dest));
}

// Minify JS
function scripts() {
    return gulp.src(paths.js.src)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.js.dest));
}

// Watch files for changes
function watchFiles() {
    gulp.watch(paths.scss.src, styles);
    gulp.watch(paths.js.src, scripts);
}

const build = gulp.series(gulp.parallel(styles, scripts), watchFiles);

exports.styles = styles;
exports.scripts = scripts;
exports.watch = watchFiles;
exports.build = build;
exports.default = build;
