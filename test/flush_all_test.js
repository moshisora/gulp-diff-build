'use strict';

var fs = require('fs'),
    assert = require('assert'),
    gulp = require('gulp'),
    diff = require('../index.js'),
    concatStream = require('concat-stream'),
    rimraf = require('rimraf');

describe('flush all', function () {
    before(function (callback) {
        rimraf('.gulp/gulp-diff-build', callback);
    });

    it('run with hash option 1', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                hash: 'hash1'
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });

    it('run with hash option 2', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                hash: 'hash2'
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });

    it('run again with hash option 1', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                hash: 'hash1'
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(0, buf.length);
                callback();
            }));
    });

    it('run again with hash option 2', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                hash: 'hash2'
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(0, buf.length);
                callback();
            }));
    });

    it('clear cache', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                clearAll: true
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });

    it('run again with hash option 1 after flush all', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                hash: 'hash1'
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });

    it('run again with hash option 2 after flush all', function (callback) {
        gulp.src('test/src/*.js')
            .pipe(diff({
                hash: 'hash2'
            }))
            .pipe(concatStream(function (buf) {
                assert.equal(3, buf.length);
                callback();
            }));
    });
});
