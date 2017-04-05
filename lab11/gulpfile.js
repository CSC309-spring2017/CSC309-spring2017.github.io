var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');

gulp.task('clean', function () {
  del('dist');
});

gulp.task('concat-js', function () {
  return gulp.src('source/js/*.js') // get all js files
    .pipe(concat('script.js'))      // concat and call it script.js
    .pipe(gulp.dest('dist/js'));    // output it.
});

gulp.task('concat-css', function () {
  return gulp.src('source/css/*.css') // get all js files
    .pipe(concat('style.css'))        // concat and call it script.js
    .pipe(gulp.dest('dist/css'));     // output it.
});

gulp.task('watch', function () {
  gulp.watch('source/**/**', ['build']);
});

gulp.task('build', ['clean', 'concat-js', 'concat-css'], function () {
  return gulp.src('source/index.html') // get the index only now.
    .pipe(gulp.dest('dist'));         // copy to dest.
});