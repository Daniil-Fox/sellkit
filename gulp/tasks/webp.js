import webp from "gulp-webp";

export const webpImages = () => {
  return app.gulp
    .src([`${app.paths.srcImgFolder}/**/**.{jpg,jpeg,png}`], {
      encoding: false,
    })
    .pipe(
      webp({
        quality: 70,
        lossless: false,
        alphaQuality: 80,
        method: 6,
        nearLossless: 60,
        sharpness: 0,
      })
    )
    .pipe(app.gulp.dest(app.paths.buildImgFolder));
};
