import fileInclude from "gulp-file-include";
import typograf from "gulp-typograf";
import replace from "gulp-replace";
import gulpif from "gulp-if";
import browserSync from "browser-sync";

export const htmlInclude = () => {
  return (
    app.gulp
      .src(`${app.paths.base.src}/*.html`)
      .pipe(
        fileInclude({
          prefix: "@",
          basepath: "@file",
        })
      )
      .pipe(
        typograf({
          locale: ["ru", "en-US"],
        })
      )
      // Добавляем скрипт libs.js перед main.js
      .pipe(
        gulpif(
          app.isProd,
          replace(
            /<script src="(.*?)js\/main(.*)\.js"><\/script>/g,
            (match) => {
              // Формируем имя файла в зависимости от режима сборки
              const libsFile = app.isProd ? "libs.min.js" : "libs.js";
              return `<script src="js/${libsFile}"></script>\n${match}`;
            }
          )
        )
      )
      // Добавляем атрибуты lazy loading для img и source
      .pipe(
        gulpif(
          app.isProd,
          replace(/<img(.*?)(?!\sloading=['"]).*?>/gs, (match) => {
            // Не изменяем изображения, у которых уже есть атрибут loading
            if (match.includes(" loading=")) {
              return match;
            }
            // Добавляем атрибут loading=lazy для всех остальных изображений
            return match.replace("<img", '<img loading="lazy"');
          })
        )
      )
      .pipe(
        gulpif(
          app.isProd,
          replace(/<source(.*?)(?!\sdecoding=['"]).*?>/gs, (match) => {
            // Не изменяем source, у которых уже есть атрибут decoding
            if (match.includes(" decoding=")) {
              return match;
            }
            // Добавляем атрибут decoding=async для всех остальных source
            return match.replace("<source", '<source decoding="async"');
          })
        )
      )
      // Замена путей для изображений, чтобы использовать AVIF и WebP
      .pipe(
        gulpif(
          app.isProd,
          replace(
            /<img src=["'](.*?\.(?:jpg|jpeg|png))["'].*?>/gs,
            (match, src) => {
              // Создаем элемент picture с поддержкой AVIF и WebP
              const baseSrc = src.replace(/\.(jpg|jpeg|png)$/, "");
              const ext = src.match(/\.(jpg|jpeg|png)$/)[0];

              return `<picture>
            <source srcset="${baseSrc}.avif" type="image/avif">
            <source srcset="${baseSrc}.webp" type="image/webp">
            ${match}
          </picture>`;
            }
          )
        )
      )
      .pipe(app.gulp.dest(app.paths.base.build))
      .pipe(browserSync.stream())
  );
};
