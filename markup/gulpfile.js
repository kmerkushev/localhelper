const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require('gulp-csso');

const jsmin = require('gulp-jsmin');


// Styles
const styles = () => {
  return gulp.src("src/sass/style.sass")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("src"))
    .pipe(sync.stream());
}

const stylesMin = () => {
  return gulp.src("src/sass/style.sass")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(gulp.dest("build"))
    .pipe(sync.stream());
}

const scriptsMin = () => {
  return gulp.src('src/*.js')
    .pipe(jsmin())
    .pipe(gulp.dest('build'))
    .pipe(sync.stream());
}

exports.styles = styles;
exports.stylesMin = stylesMin;
exports.scriptsMin = scriptsMin;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'src'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("src/sass/blocks/*.sass").on("change", gulp.series("styles"));
  gulp.watch("src/sass/vendor/*.sass").on("change", gulp.series("styles"));
  gulp.watch("src/*.html").on("change", sync.reload);
  gulp.watch("src/*.css").on("change", sync.reload);
  gulp.watch("src/*.js").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);
