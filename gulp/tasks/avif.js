import avif from "gulp-avif";
import newer from "gulp-newer";

export const avifImages = () => {
  return app.gulp
    .src([`${app.paths.srcImgFolder}/**/**.{jpg,jpeg,png}`], {
      encoding: false,
    })
    .pipe(newer(app.paths.buildImgFolder))
    .pipe(
      avif({
        quality: 65, // Более низкое качество для AVIF, так как он эффективнее при сжатии
        speed: 3, // Баланс между скоростью и качеством сжатия (от 0 до 8, где 0 - самое медленное, но качественное)
      })
    )
    .pipe(app.gulp.dest(app.paths.buildImgFolder));
};
