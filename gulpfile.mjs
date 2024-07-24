import gulp from "gulp";
import sass from "gulp-sass";
import nodeSass from "sass"; // Убедитесь, что sass установлен
import autoprefixer from "autoprefixer";
import postcss from "gulp-postcss";
import cleanCSS from "gulp-clean-css";
import concat from "gulp-concat";
import rename from "gulp-rename";
import uglify from "gulp-uglify";
import sourcemaps from "gulp-sourcemaps";
import browserSync from "browser-sync";
import ghPages from "gulp-gh-pages";
import svgSprite from "gulp-svg-sprite";
import postcssImport from "postcss-import";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";

const browserSyncInstance = browserSync.create();

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
    src: "src/svg/**/*.svg",
    dest: "dist/svg/",
  },
};

// Настройка gulp-sass с использованием компилятора Sass
const sassCompiler = sass(nodeSass); // Используем node-sass как компилятор

// Компиляция SCSS в CSS
export function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sassCompiler().on("error", sassCompiler.logError))
    .pipe(postcss([postcssImport(), autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(
      rename({
        basename: "main",
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSyncInstance.stream());
}

// Минификация и объединение JS файлов
export function scripts() {
  return gulp
    .src(paths.scripts.src, { sourcemaps: true })
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSyncInstance.stream());
}

// Оптимизация изображений и конвертация в WebP
export function images() {
  return gulp
    .src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
    .pipe(
      webp({
        quality: 100,
      })
    )
    .pipe(gulp.dest(paths.images.dest));
}

const spriteConfig = {
  mode: {
    symbol: {
      sprite: "sprite.svg", // Название итогового файла спрайта
      example: false, // Не создавать HTML файл с примером
    },
  },
  shape: {
    dimension: {
      // Настройки размера
      maxWidth: 32,
      maxHeight: 32,
    },
    spacing: {
      // Интервал между иконками
      padding: 10,
    },
  },
  svg: {
    xmlDeclaration: false, // Не добавлять декларацию XML
    doctypeDeclaration: false, // Не добавлять декларацию doctype
  },
};

// Создание SVG спрайта
export function sprite() {
  return gulp
    .src(paths.svg.src)
    .pipe(svgSprite(spriteConfig))
    .pipe(gulp.dest(paths.svg.dest));
}

// Слежение за изменениями в файлах
export function watch() {
  browserSyncInstance.init({
    server: {
      baseDir: "./",
    },
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.svg.src, sprite);
  gulp.watch("./*.html").on("change", browserSyncInstance.reload);
}

// Задача для развертывания на GitHub Pages
export function deploy() {
  return gulp.src("./dist/**/*").pipe(ghPages());
}

const build = gulp.series(gulp.parallel(styles, scripts, images, sprite));

export default gulp.series(build, watch);
