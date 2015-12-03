const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const minify = require('gulp-minify');

gulp.task('dev', () => {
  return browserify({
    entries: 'src/index.js',
    debug: true,
    transform: [babelify],
    paths: ['src']
  })
  .bundle()
  .pipe(source('glut.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('prod', () => {
  return browserify({
    entries: 'src/index.js',
    transform: [babelify],
    paths: ['src']
  })
  .bundle()
  .pipe(source('glut.min.js'))
	.pipe(buffer())
	.pipe(minify())
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch(['src/*.js', 'src/**/*.js'], ['dev'])
});

gulp.task('default', ['dev', 'watch']);
