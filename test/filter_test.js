'use strict';

var fs = require('fs'),
    assert = require('assert'),
    gulp = require('gulp'),
    diff = require('../index.js'),
    concatStream = require('concat-stream'),
    rimraf = require('rimraf'),
    through = require('through2');

const capture = require('./captureStream.js')( process.stdout );
capture.reset();

describe('filter', function () {
    before(function (callback) {
        rimraf('.gulp/gulp-diff-build', callback);
    });

    it('filter by string', function (callback) {
        capture.on();
        gulp.src('test/src/*.js')
            .pipe(diff({
                clear: true,
                dest: 'test/src/2.js'
            }))
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] flushing hash...') > -1);
                assert(out.indexOf('[diff warning] hash file does not exist.') > -1);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(1, buf.length);
                assert.equal(fs.realpathSync('./') + '/test/src/2.js', buf[0].path);
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });

    it('filter by string - stream', function (callback) {
        capture.on();
        gulp.src('test/src/*.js',{buffer:false})
            .pipe(diff({
                clear: true,
                dest: 'test/src/3.js'
            }))
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] flushing hash...') > -1);
                assert(out.indexOf('[diff log] flushing hash completed!') > -1);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(1, buf.length);
                assert.equal(fs.realpathSync('./') + '/test/src/3.js', buf[0].path);
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });

    it('filter by array', function (callback) {
        capture.on();
        gulp.src('test/src/*.js')
            .pipe(diff({
                clear: true,
                dest: [
                    'test/src/2.js',
                    'test/src/3.js'
                ]
            }))
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] flushing hash...') > -1);
                assert(out.indexOf('[diff log] flushing hash completed!') > -1);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(2, buf.length);
                assert.equal(fs.realpathSync('./') + '/test/src/2.js', buf[0].path);
                assert.equal(fs.realpathSync('./') + '/test/src/3.js', buf[1].path);
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });

    it('filter by array - stream', function (callback) {
        capture.on();
        gulp.src('test/src/*.js',{buffer:false})
            .pipe(diff({
                clear: true,
                dest: [
                    'test/src/2.js',
                    'test/src/3.js'
                ]
            }))
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] flushing hash...') > -1);
                assert(out.indexOf('[diff log] flushing hash completed!') > -1);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(2, buf.length);
                assert.equal(fs.realpathSync('./') + '/test/src/2.js', buf[0].path);
                assert.equal(fs.realpathSync('./') + '/test/src/3.js', buf[1].path);
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });
});
