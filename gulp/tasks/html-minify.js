import htmlmin from "gulp-htmlmin";
import gulp from "gulp";

export const htmlMinify = () => {
  return gulp
    .src(`${app.paths.base.build}*.html`)
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      })
    )
    .pipe(gulp.dest(app.paths.base.build));
};
