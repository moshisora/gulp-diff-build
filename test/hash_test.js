'use strict';

var fs = require('fs'),
    assert = require('assert'),
    gulp = require('gulp'),
    diff = require('../index.js'),
    concatStream = require('concat-stream'),
    rimraf = require('rimraf');

const capture = require('./captureStream.js')( process.stdout );
capture.reset();

describe('hash', function () {
    before(function (callback) {
        rimraf('.gulp/gulp-diff-build', callback);
    });

    it('run as default hash', function (callback) {
        capture.on();
        gulp.src('test/src/*.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(3, buf.length);
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });

    it('run as another hash', function (callback) {
        capture.on();
        gulp.src('test/src/*.js')
            .pipe(diff({
                hash: 'another'
            }))
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(3, buf.length);
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });

    it('clear another hash', function (callback) {
        capture.on();
        gulp.src('test/src/*.js')
            .pipe(diff({
                clear: true,
                hash: 'another'
            }))
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] flushing hash...') > -1);
                assert(out.indexOf('[diff log] flushing hash completed!') > -1);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(3, buf.length);
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });

    it('default hash is not cleard', function (callback) {
        capture.on();
        gulp.src('test/src/*.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] No changes.') > -1);
                assert.equal(0, buf.length);
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });
});
