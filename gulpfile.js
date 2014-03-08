'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var stylish = require('jshint-stylish');

var paths = {
	source: 'index.js',
	tests: 'test/**/*.js'
};

gulp.task('lint', function () {
	return gulp.src([paths.source, paths.tests])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('test', function () {
	return gulp.src(paths.tests)
		.pipe(mocha())
		.on('error', function () {
			this.emit('end');
		});
});

gulp.task('default', ['lint', 'test']);