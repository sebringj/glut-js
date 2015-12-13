var gulp = require('gulp')

var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var babel = require('gulp-babel');
var source = require('vinyl-source-stream');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var transform = require('vinyl-transform');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var out = require('gulp-out');

gulp.task('dev', function() {
	return browserify({
			entries: './src/index.js',
			debug: true
		})
    .transform('babelify', {presets: ['es2015']})
		.bundle()
		.pipe(source('glut.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('prod', function() {
	var browserified = transform(function(filename) {
		return browserify(filename)
			.bundle();
	});

  return browserify({
    entries: './src/index.js',
  })
    .transform('babelify', { presets: ['es2015'] })
		.bundle()
    .pipe(source('glut.js'))
    .pipe(buffer())
    .pipe(minify())
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['dev'], function() {
	gulp.watch('*.js', ['dev']);
});

gulp.task('default', ['watch']);
