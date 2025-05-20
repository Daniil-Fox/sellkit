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
              const libsFile = app.isProd ? "libs.min.js" : "libs.js";
              return `<script src="js/${libsFile}" defer crossorigin="anonymous"></script>\n${match}`;
            }
          )
        )
      )
      // Оптимизируем загрузку изображений
      .pipe(
        gulpif(
          app.isProd,
          replace(/<img(.*?)(?!\sloading=['"]).*?>/gs, (match) => {
            // Не изменяем изображения, у которых уже есть атрибут loading
            if (match.includes(" loading=")) {
              return match;
            }

            // Добавляем атрибуты для оптимизации загрузки и кэширования
            let optimizedMatch = match.replace(
              "<img",
              '<img loading="lazy" decoding="async"'
            );

            // Добавляем fetchpriority для изображений выше фолда
            if (
              match.includes('class="hero') ||
              match.includes('class="header')
            ) {
              optimizedMatch = optimizedMatch.replace(
                'loading="lazy"',
                'fetchpriority="high"'
              );
            }

            // Добавляем атрибуты для кэширования
            if (!optimizedMatch.includes("crossorigin=")) {
              optimizedMatch = optimizedMatch.replace(
                ">",
                ' crossorigin="anonymous">'
              );
            }

            return optimizedMatch;
          })
        )
      )
      // Оптимизируем загрузку стилей
      .pipe(
        gulpif(
          app.isProd,
          replace(
            /<link rel="stylesheet"(.*?)>/g,
            '<link rel="stylesheet"$1 crossorigin="anonymous">'
          )
        )
      )
      // Оптимизируем загрузку шрифтов
      .pipe(
        gulpif(
          app.isProd,
          replace(
            /<link rel="preload" as="font"(.*?)>/g,
            '<link rel="preload" as="font"$1 crossorigin="anonymous">'
          )
        )
      )
      // Добавляем preconnect для внешних ресурсов
      .pipe(
        gulpif(
          app.isProd,
          replace(
            /<head>/,
            `<head>
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">`
          )
        )
      )
      .pipe(app.gulp.dest(app.paths.base.build))
      .pipe(browserSync.stream())
  );
};
