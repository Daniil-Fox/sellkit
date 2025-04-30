import webp from "gulp-webp";

export const webpImages = () => {
  return app.gulp
    .src([`${app.paths.srcImgFolder}/**/**.{jpg,jpeg,png}`], {
      encoding: false,
    })
    .pipe(
      webp({
        quality: 80,
        lossless: false,
        alphaQuality: 90,
        method: 6,
      })
    )
    .pipe(app.gulp.dest(app.paths.buildImgFolder));
};
