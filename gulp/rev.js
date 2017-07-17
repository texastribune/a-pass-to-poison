const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');
const rev = require('gulp-rev');

const WEBPACK_MANIFEST = path.join(
  process.cwd(),
  'dist/scripts/rev-manifest.json'
);
const REV_MANIFEST = path.join(process.cwd(), 'dist/rev-manifest.json');

module.exports = () => {
  if (fs.existsSync(WEBPACK_MANIFEST)) {
    fs.moveSync(WEBPACK_MANIFEST, REV_MANIFEST);
  }

  return gulp
    .src(['./dist/**/*.css', './dist/assets/images/**/*'], {
      base: './dist',
    })
    .pipe(gulp.dest('./dist'))
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest({ cwd: './dist', merge: true }))
    .pipe(gulp.dest('./dist'));
};
