'use strict'

var fs = require('fs'),
    assert = require('assert'),
    gulp = require('gulp'),
    util = require('util'),
    diff = require('./diff.js'),
    concatStream = require('concat-stream'),
    rimraf = require('rimraf');

describe('run', function () {
    before(function (callback) {
        rimraf('.gulp/gulp-diff-build', callback);
    });

    it('run first time', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });

    it('run again', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                assert.equal(0, buf.length);
                callback();
            }));
    });

    it('clear cache', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                clear: true
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });

    it('filter by string', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                clear: true,
                dest: 'test/src/2.js'
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(1, buf.length);
                assert.equal(fs.realpathSync('./') + '/test/src/2.js', buf[0].path);
                callback();
            }));
    });

    it('filter by array', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                clear: true,
                dest: [
                    'test/src/2.js',
                    'test/src/3.js'
                ]
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(2, buf.length);
                assert.equal(fs.realpathSync('./') + '/test/src/2.js', buf[0].path);
                assert.equal(fs.realpathSync('./') + '/test/src/3.js', buf[1].path);
                callback();
            }));
    });
});

describe('cache', function () {
    it('run to cache', function (callback) {
        gulp.src('test/src/1.js')
            .pipe(diff({
                clear: true
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(1, buf.length);
                callback();
            }));
    });

    it('run to cache another file', function (callback) {
        gulp.src('test/src/2.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                assert.equal(1, buf.length);
                callback();
            }));
    });

    it('check keeping cache', function (callback) {
        gulp.src('test/src/1.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                assert.equal(0, buf.length);
                callback();
            }));
    });
});
