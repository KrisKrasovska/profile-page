const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const ghPages = require("gulp-gh-pages");

// Пути к исходным файлам
const paths = {
  styles: {
    src: "src/scss/**/*.scss",
    dest: "dist/css",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/js",
  },
};

// Компиляция SCSS в CSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(
      rename({
        basename: "main",
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Минификация и объединение JS файлов
function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Слежение за изменениями в файлах
function watch() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch("./*.html").on("change", browserSync.reload);
}

// Задача для развертывания на GitHub Pages
function deploy() {
  return gulp.src("./dist/**/*").pipe(ghPages());
}

const build = gulp.series(gulp.parallel(styles, scripts));

exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.deploy = deploy;
exports.default = gulp.series(build, watch);
