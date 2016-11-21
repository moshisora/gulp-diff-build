'use strict'

var fs = require('fs'),
    assert = require('assert'),
    gulp = require('gulp'),
    diff = require('../diff.js'),
    concatStream = require('concat-stream'),
    rimraf = require('rimraf');

describe('cache', function () {
    before(function (callback) {
        rimraf('.gulp/gulp-diff-build', callback);
    });

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
