const gulp = require("gulp");
const sass = require("gulp-sass");
const del = require('del');
const cache = require("gulp-cache");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const minifyCSS = require("gulp-minify-css");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

function style() {
  return gulp
    .src("./src/assets/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(concat("main.min.css"))
    .pipe(minifyCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./src/assets/css"))
    .pipe(gulp.dest("./build/assets/css"))
    .pipe(browserSync.stream());
}

function js() {
  return gulp
    .src("./src/assets/js/**/*.js")
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./src/assets/js"))
    .pipe(gulp.dest("./build/assets/js"))
    .pipe(browserSync.reload());
}

function html() {
  return gulp
    .src("./src/*.html")
    .pipe(gulp.dest("./build"))
    .pipe(browserSync.stream());
}

function images() {
  return gulp
    .src("./src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(
      cache(
        imagemin({
          interlaced: true,
        })
      )
    )
    .pipe(gulp.dest("./build/assets/img"))
    .pipe(browserSync.stream());
}

function clean() {
  return del.sync("./build");
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./src",
      index: "/index.html",
    },
  });
  gulp.watch("./src/assets/scss/**/*.scss", style);
  gulp.watch("./src/assets/img/**/*.+(png|jpg|jpeg|gif|svg)", images);
  gulp.watch("./src/*.html", html).on("change", browserSync.reload);
  gulp.watch("./src/assets/js/**/*.js", js).on("change", browserSync.reload);
}

exports.style = style;
exports.js = js;
exports.images = images;
exports.html = html;
exports.watch = watch;
exports.clean = clean;
