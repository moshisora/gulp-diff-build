'use strict'

const assert = require('assert'),
  gulp = require('gulp'),
  diff = require('../index.js'),
  concatStream = require('concat-stream'),
  rimraf = require('rimraf')

const capture = require('./captureStream.js')(process.stdout)
capture.reset()

describe('flush all', function () {
  before(function (callback) {
    rimraf('.gulp/gulp-diff-build', callback)
  })

  it('run with hash option 1', function (callback) {
    capture.on()
    gulp.src('test/src/*.js')
      .pipe(diff({
        hash: 'hash1'
      }))
      .pipe(concatStream(function (buf) {
        const out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.changes))
        assert.equal(3, buf.length)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })

  it('run with hash option 2', function (callback) {
    capture.on()
    gulp.src('test/src/*.js')
      .pipe(diff({
        hash: 'hash2'
      }))
      .pipe(concatStream(function (buf) {
        const out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.changes))
        assert.equal(3, buf.length)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })

  it('run again with hash option 1', function (callback) {
    capture.on()
    gulp.src('test/src/*.js')
      .pipe(diff({
        hash: 'hash1'
      }))
      .pipe(concatStream(function (buf) {
        const out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.noChanges))
        assert.equal(0, buf.length)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })

  it('run again with hash option 2', function (callback) {
    capture.on()
    gulp.src('test/src/*.js')
      .pipe(diff({
        hash: 'hash2'
      }))
      .pipe(concatStream(function (buf) {
        let out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.noChanges))
        assert.equal(0, buf.length)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })

  it('clear cache', function (callback) {
    capture.on()
    gulp.src('test/src/*.js')
      .pipe(diff({
        clearAll: true
      }))
      .pipe(concatStream(function (buf) {
        const out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.flushingAll))
        assert(out.has(capture.messages.flushingAllCompleted))
        assert(out.has(capture.messages.changes))
        assert.equal(3, buf.length)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })

  it('run again with hash option 1 after flush all', function (callback) {
    capture.on()
    gulp.src('test/src/*.js')
      .pipe(diff({
        hash: 'hash1'
      }))
      .pipe(concatStream(function (buf) {
        let out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.changes))
        assert.equal(3, buf.length)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })

  it('run again with hash option 2 after flush all', function (callback) {
    capture.on()
    gulp.src('test/src/*.js')
      .pipe(diff({
        hash: 'hash2'
      }))
      .pipe(concatStream(function (buf) {
        const out = capture.get()
        capture.off(false)
        assert(out.has(capture.messages.changes))
        assert.equal(3, buf.length)
        callback()
      }))
      .on('unpipe', function () {
        capture.reset()
      })
  })
})
