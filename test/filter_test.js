'use strict';

var fs = require('fs'),
    assert = require('assert'),
    gulp = require('gulp'),
    diff = require('../diff.js'),
    concatStream = require('concat-stream'),
    rimraf = require('rimraf');

describe('filter', function () {
    before(function (callback) {
        rimraf('.gulp/gulp-diff-build', callback);
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
