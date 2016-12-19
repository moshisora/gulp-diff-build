'use strict';

var fs = require('fs'),
    assert = require('assert'),
    gulp = require('gulp'),
    diff = require('../index.js'),
    concatStream = require('concat-stream'),
    rimraf = require('rimraf');

describe('hash', function () {
    before(function (callback) {
        rimraf('.gulp/gulp-diff-build', callback);
    });

    it('run as default hash', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });

    it('run as another hash', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                hash: 'another'
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });

    it('clear another hash', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                clear: true,
                hash: 'another'
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });

    it('default hash is not cleard', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                assert.equal(0, buf.length);
                callback();
            }));
    });
});
