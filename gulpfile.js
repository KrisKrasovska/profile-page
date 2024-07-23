const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const ghPages = require("gulp-gh-pages");
const svgSprite = require("gulp-svg-sprite");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssimport = require("postcss-import");

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
  images: {
    src: "src/images/**/*.{jpg,jpeg,png,svg,gif}",
    dest: "dist/images",
  },
  svg: {
    src: "src/svg/**/*.svg", // Путь к исходным SVG файлам
    dest: "dist/svg/", // Путь к конечному SVG спрайту
  },
};

// Компиляция SCSS в CSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(
      postcss([
        cssimport(), // Импорт CSS файлов (включая modern-normalize)
        autoprefixer(), // Автопрефиксы для поддержки различных браузеров
      ])
    )
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

// Оптимизация изображений
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(webp())
    .pipe(gulp.dest(paths.images.dest));
}

// Создание SVG спрайта
function sprite() {
  return gulp
    .src(paths.svg.src)
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: "sprite.svg", // Имя файла спрайта
          },
        },
      })
    )
    .pipe(gulp.dest(paths.svg.dest));
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
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.svg.src, sprite);
  gulp.watch("./*.html").on("change", browserSync.reload);
}

// Задача для развертывания на GitHub Pages
function deploy() {
  return gulp.src("./dist/**/*").pipe(ghPages());
}

const build = gulp.series(gulp.parallel(styles, scripts, images, sprite));

exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.sprite = sprite;
exports.watch = watch;
exports.build = build;
exports.deploy = deploy;
exports.default = gulp.series(build, watch);
