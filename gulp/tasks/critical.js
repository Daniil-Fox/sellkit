import * as critical from "critical";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

export const criticalCSS = (done) => {
  const buildPath = app.paths.base.build;
  const htmlFiles = [
    "index.html",
    "app.html",
    "cases.html",
    "cost.html",
    "courier.html",
    "analitic.html",
  ];

  htmlFiles.forEach((file) => {
    const htmlPath = path.join(buildPath, file);

    critical
      .generate({
        inline: true,
        base: buildPath,
        src: file,
        target: {
          html: file,
          css: `css/critical-${file.replace(".html", "")}.css`,
        },
        width: 375, // Мобильная ширина
        height: 667, // Высота типичного мобильного экрана
        ignore: {
          atrule: ["@font-face"], // Игнорируем @font-face
        },
        dimensions: [
          {
            width: 375,
            height: 667,
          },
          {
            width: 1024,
            height: 768,
          },
        ],
        minify: true,
        extract: true, // Извлечь некритический CSS
      })
      .then((result) => {
        // Записать обновленный файл с встроенным критическим CSS
        writeFileSync(htmlPath, result.html);
        console.log(`Критический CSS сгенерирован для ${file}`);
      })
      .catch((err) => {
        console.error(
          `Ошибка при генерации критического CSS для ${file}:`,
          err
        );
      });
  });

  done();
};
