'use strict'

const util = require('gulp-util');
const through = require('through2');
const fs = require('fs');
const crypto = require('crypto');

const SETTING = {
    hash: '.gulp/gulp-diff-build/hash.json'
};

module.exports = function (options) {
    options = options || {};

    var files = [],
        filePaths = [],
        filter = [],
        cached = {},
        hasDiff = false,
        regexp = new RegExp(fs.realpathSync('./') + '/');

    if (options.clear === true) flushHash();

    if ('dest' in options) {
        if (Array.isArray(options.dest)) {
            filter = options.dest;
        } else if (typeof (options.dest) === 'string') {
            filter.push(options.dest);
        } else {
            util.log(util.colors.red('[error] dest is invalid value'));
        }
    }

    if (isExistFile(SETTING.hash)) {
        cached = JSON.parse(fs.readFileSync(SETTING.hash, 'utf8'));
    } else {
        hasDiff = true;
    }

    return through.obj(transform, flush);

    function transform(file, encoding, callback) {
        var filename = file.path.replace(regexp, '');

        if (!hasDiff && (cached[filename] !== sha1(file.contents))) {
            hasDiff = true;
        }

        if ((filter.length === 0) || (filter.indexOf(filename) >= 0)) {
            files.push(file);
            filePaths.push(filename);
        }
        callback();
    }

    function flush(callback) {
        var me = this,
            hash = {};

        if (hasDiff) {
            Array.from(files).forEach(function (file, index) {
                me.push(file);

                var filename = filePaths[index];
                hash[filename] = sha1(file.contents);
            });
            fs.writeFileSync(SETTING.hash, JSON.stringify(hash), {
                encoding: 'utf8',
            });
        }

        callback();
        return;
    }
};

function sha1(buf) {
    return crypto.createHash('sha1').update(buf).digest('hex');
}

function isExistFile(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') return false;
    }
}

function flushHash() {
    util.log('[log] flushing hash...');

    if (!isExistFile(SETTING.hash)) {
        util.log(util.colors.red('[error] hash file is not exist.'));
        return;
    }

    fs.unlinkSync(SETTING.hash);
    util.log(util.colors.green('[log] flushing hash was completed!'));
}
