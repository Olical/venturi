'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('lint', function () {
	return gulp.src('index.js')
		.pipe(jshint());
});

gulp.task('test', function () {
	return gulp.src('test.js')
		.pipe(mocha());
});

gulp.task('default', ['lint', 'test']);