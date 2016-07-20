/*jshint globalstrict: true*/
/*global require*/

'use strict';

var gulp = require('gulp');
var jdists = require('gulp-jdists');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

gulp.task('build', function() {
  return gulp.src(['src/examplejs.js'])
    .pipe(jdists({
      trigger: 'release',
      remove: 'remove,funcTemplate,debug'
    }))
    .pipe(gulp.dest('./'))
    .pipe(uglify())
    .pipe(rename('examplejs.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);