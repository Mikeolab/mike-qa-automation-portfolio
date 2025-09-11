/**
 * =============================================================================== *
 * ------------------------------------------------------------------------------- *
 ** UPDATE "./gulp/gulp.localhost.js" WITH YOUR LOCALHOST ROOT URL AND THEME NAME **
 * ------------------------------------------------------------------------------- *
 * =============================================================================== *
 */
// ANCHOR Load plugins
const gulp = require("gulp");
// ANCHOR Require theme tasks
const remove = require("./gulp/tasks/delete.files");
const styles = require("./gulp/tasks/compiled.styles");
const critical = require("./gulp/tasks/critical.styles");
const block = require("./gulp/tasks/block.script");
const vendor = require("./gulp/tasks/vendor.script");
const lint = require("./gulp/tasks/lint.styles");
const imageMin = require("./gulp/tasks/minify.image");
const imgWebp = require("./gulp/tasks/webp.image");
const resizer = require("./gulp/tasks/resizer.image");
const gulpConfig = require("./gulp/gulp.config.js");

function buildStyles() {
  return gulp.series(remove.clean, lint.task, styles.task);
}

function buildCriticalStyles() {
  return gulp.series(lint.task, critical.task);
}

function buildBlockScript() {
  return gulp.series(block.task);
}

function buildImageMinify() {
  return gulp.series(imageMin.task);
}
function buildImageWebp() {
  return gulp.series(imgWebp.task);
}
function buildImageResizer() {
  return gulp.series(resizer.task);
}

function buildVendorScript() {
  return gulp.series(vendor.task);
}

function stylelint() {
  return gulp.series(lint.task);
}

function clean() {
  return gulp.series(remove.compiled);
}

function build() {
  return gulp.series(
    clean(),
    remove.clean,
    lint.task,
    styles.task,
    critical.task,
    block.task,
    vendor.task
  );
}
function rebuild() {
  return gulp.series(clean(), lint.task, styles.task);
}

// Watch: source paths
const watchLintPaths = gulpConfig.config.scss.lint.watch;
const watchBlockScriptsPaths = gulpConfig.config.js.block.watch;
const watchVendorScriptsPaths = gulpConfig.config.js.vendor.watch;

function watchFiles() {
  gulp.watch(
    watchLintPaths,
    { events: "change", delay: 1000 },
    gulp.series(remove.clean, styles.task, block.task, lint.task, watch)
  );
  gulp.watch(
    watchBlockScriptsPaths,
    { events: "change", delay: 1000 },
    gulp.series(block.task)
  );
  gulp.watch(
    watchVendorScriptsPaths,
    { events: "change", delay: 1000 },
    gulp.series(vendor.task)
  );
}
const watch = gulp.parallel(watchFiles);

exports.buildStyles = buildStyles();
exports.buildCritical = buildCriticalStyles();
exports.buildBlockScript = buildBlockScript();
exports.buildImageMinify = buildImageMinify();
exports.buildImageWebp = buildImageWebp();
exports.buildImageResizer = buildImageResizer();
exports.buildVendorScript = buildVendorScript();
exports.stylelint = stylelint();
exports.clean = clean();
exports.rebuild = rebuild();
exports.build = build();
exports.watch = watch;
