'use strict';

var fs = require('fs'),
    assert = require('assert'),
    gulp = require('gulp'),
    diff = require('../index.js'),
    concatStream = require('concat-stream'),
    rimraf = require('rimraf');

const capture = require('./captureStream.js')( process.stdout );
capture.reset();

describe('run', function () {
    fs.writeFileSync('test/src/1.js', '/* create a dummy file */', {
        encoding: 'utf8',
    });
    var originalContent = fs.readFileSync('test/src/1.js', 'utf8');

    before(function (callback) {
        rimraf('.gulp/gulp-diff-build', callback);
    });

    it('run first time', function (callback) {
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

    it('run again', function (callback) {
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

    it('run again - stream', function (callback) {
        capture.on();
        gulp.src('test/src/*.js',{buffer:false})
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

    it('file has changed', function (callback) {
        fs.writeFileSync('test/src/1.js', 'var a = 1;', {
            encoding: 'utf8',
        });
        
        capture.on();
        gulp.src('test/src/1.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(1, buf.length);
                assert.equal(fs.realpathSync('./') + '/test/src/1.js', buf[0].path);

                fs.writeFileSync('test/src/1.js', originalContent, {
                    encoding: 'utf8',
                });
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });

    it('file has changed - stream', function (callback) {
        fs.writeFileSync('test/src/1.js', 'var a = 1;', {
            encoding: 'utf8',
        });

        capture.on();
        gulp.src('test/src/1.js',{buffer:false})
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(1, buf.length);
                assert.equal(fs.realpathSync('./') + '/test/src/1.js', buf[0].path);

                fs.writeFileSync('test/src/1.js', originalContent, {
                    encoding: 'utf8',
                });
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });

    it('clear cache', function (callback) {
        capture.on();
        gulp.src('test/src/*.js')
            .pipe(diff({
                clear: true
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

    it('delete file', function (callback) {
        rimraf('test/src/1.js', callback);
    });

    it('changing should detect after file deleting', function (callback) {
        capture.on();
        gulp.src('test/src/*.js')
            .pipe(diff())
            .pipe(concatStream(function (buf) {
                let out = capture.get(true);
                capture.off(false);
                assert(out.indexOf('[diff log] Changes detected.') > -1);
                assert.equal(2, buf.length);

                fs.writeFileSync('test/src/1.js', originalContent, {
                    encoding: 'utf8',
                });
                callback();
            }))
            .on('unpipe',function(){capture.reset()});
    });
});
