'use strict'

const fs = require('fs'),
  assert = require('assert'),
  gulp = require('gulp'),
  diff = require('../index.js'),
  concatStream = require('concat-stream'),
  rimraf = require('rimraf')

const capture = require('./captureStream.js')(process.stdout)
capture.reset()

describe('filter', function () {
  before(function (callback) {
    rimraf('.gulp/gulp-diff-build', callback)
  })

  it('filter by string', function (callback) {
    capture.on()
    gulp.src('test/src/*.js')
      .pipe(diff({
        clear: true,
        dest: 'test/src/2.js'
      }))
      .pipe(concatStream(function (buf) {
        const out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.flushing))
        assert(out.has(capture.messages.hashNotExisting))
        assert(out.has(capture.messages.changes))
        assert.equal(1, buf.length)
        assert.equal(fs.realpathSync('./') + '/test/src/2.js', buf[0].path)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })

  it('filter by string - stream', function (callback) {
    capture.on()
    gulp.src('test/src/*.js', { buffer: false })
      .pipe(diff({
        clear: true,
        dest: 'test/src/3.js'
      }))
      .pipe(concatStream(function (buf) {
        const out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.flushing))
        assert(out.has(capture.messages.flushingCompleted))
        assert(out.has(capture.messages.changes))
        assert.equal(1, buf.length)
        assert.equal(fs.realpathSync('./') + '/test/src/3.js', buf[0].path)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })

  it('filter by array', function (callback) {
    capture.on()
    gulp.src('test/src/*.js')
      .pipe(diff({
        clear: true,
        dest: [
          'test/src/2.js',
          'test/src/3.js'
        ]
      }))
      .pipe(concatStream(function (buf) {
        const out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.flushing))
        assert(out.has(capture.messages.flushingCompleted))
        assert(out.has(capture.messages.changes))
        assert.equal(2, buf.length)
        assert.equal(fs.realpathSync('./') + '/test/src/2.js', buf[0].path)
        assert.equal(fs.realpathSync('./') + '/test/src/3.js', buf[1].path)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })

  it('filter by array - stream', function (callback) {
    capture.on()
    gulp.src('test/src/*.js', { buffer: false })
      .pipe(diff({
        clear: true,
        dest: [
          'test/src/2.js',
          'test/src/3.js'
        ]
      }))
      .pipe(concatStream(function (buf) {
        const out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.flushing))
        assert(out.has(capture.messages.flushingCompleted))
        assert(out.has(capture.messages.changes))
        assert.equal(2, buf.length)
        assert.equal(fs.realpathSync('./') + '/test/src/2.js', buf[0].path)
        assert.equal(fs.realpathSync('./') + '/test/src/3.js', buf[1].path)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })
})
