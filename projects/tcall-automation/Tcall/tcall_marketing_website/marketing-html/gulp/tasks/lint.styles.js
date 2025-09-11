const gulpConfig = require('../gulp.config.js');
const gulp = require("gulp");
const fancyLog = require('fancy-log');
const gulpStylelint = require('@ronilaukkarinen/gulp-stylelint');
const gulpIf = require('gulp-if');

const lint = gulpConfig.config.lint;

function lintStyles() {
    return gulp
        .src(lint.src)
        .pipe(gulpStylelint({
            reporters: [
                {
                    formatter: 'string',
                    console: true,
                    save: lint.errorlog,
                    failAfterError: false, // Changed to false to prevent process exit
                }
            ],
            debug: true,
            fix: true
        }))
        .pipe(gulpIf(file => file.stylelint && file.stylelint.output, gulp.dest(file => file.base)))
        .on('error', function (e) {
            console.log("Stylelint errors found. Please fix them manually.");
            this.emit('end'); // This prevents the process from exiting
        })
        .on('end', () => {
            fancyLog('CSS Lint task completed');
        });
}

module.exports = {
    task: lintStyles,
}
