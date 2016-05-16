/*jshint globalstrict: true*/
/*global require*/

'use strict';

var gulp = require('gulp');
var jdists = require('gulp-jdists');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var examplejs = require('gulp-examplejs');
var replace = require('gulp-replace');

gulp.task('example-js', function() {
  return gulp.src('src/**.js')
    .pipe(examplejs({
      head: 'head.js'
    }))
    .pipe(gulp.dest('test'));
});

gulp.task('example-readme', function() {
  return gulp.src('README.md')
    .pipe(replace(/　/g, '  ')) // 处理全角空格
    .pipe(examplejs())
    .pipe(rename('readme.js'))
    .pipe(gulp.dest('test'));
});

gulp.task('example', ['example-js', 'example-readme']);

gulp.task('build', function() {
  return gulp.src(['src/examplejs.js'])
    .pipe(jdists({
      trigger: 'release'
    }))
    .pipe(gulp.dest('./'))
    .pipe(uglify())
    .pipe(rename('examplejs.min.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);