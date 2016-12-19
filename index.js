'use strict';

const util = require('gulp-util');
const through = require('through2');
const fs = require('fs');
const crypto = require('crypto');
const mkdirp = require('mkdirp');

const SETTING = {
    path: '.gulp/gulp-diff-build/',
    hash: '.gulp/gulp-diff-build/hash.json'
};

module.exports = function (options) {
    options = options || {};

    var destFiles = [],
        hashFiles = [],
        hashPaths = [],
        filter = [],
        cached = {},
        hasDiff = false,
        hashPath = '';

    if ('dest' in options) {
        if (Array.isArray(options.dest)) {
            filter = options.dest;
        } else if (typeof (options.dest) === 'string') {
            filter.push(options.dest);
        } else {
            util.log(util.colors.red('[error] dest is invalid value'));
        }
    }

    if (typeof (options.hash) === 'string') {
        hashPath = options.hash;
        if (!hashPath.match(/\.json$/)) hashPath += '.json';
        hashPath = SETTING.path + hashPath;
    }

    hashPath = hashPath || SETTING.hash;

    if (options.clear === true) flushHash(hashPath);

    if (isFileExist(hashPath)) {
        cached = JSON.parse(fs.readFileSync(hashPath, 'utf8'));
    } else {
        hasDiff = true;
    }

    return through.obj(transform, flush);

    function transform(file, encoding, callback) {
        var regexp = new RegExp(fs.realpathSync('./') + '/'),
            filename = file.path.replace(regexp, '');

        if (!hasDiff && (cached[filename] !== sha1(file.contents))) {
            hasDiff = true;
        }

        hashFiles.push(file);
        hashPaths.push(filename);

        if ((filter.length === 0) || (filter.indexOf(filename) >= 0)) {
            destFiles.push(file);
        }
        callback();
    }

    function flush(callback) {
        var me = this,
            hash = cached;

        if (hasDiff) {
            Array.from(hashFiles).forEach(function (file, index) {
                var filename = hashPaths[index];
                hash[filename] = sha1(file.contents);
            });
            mkdirp.sync(hashPath.replace(/[^\/]+\.json$/, ''));
            fs.writeFileSync(hashPath, JSON.stringify(hash), {
                encoding: 'utf8',
            });

            Array.from(destFiles).forEach(function (file, index) {
                me.push(file);
            });
        }
        callback();
    }
};

function sha1(buf) {
    return crypto.createHash('sha1').update(buf).digest('hex');
}

function isFileExist(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') return false;
    }
}

function flushHash(hashPath) {
    util.log('[log] flushing hash...');

    if (!isFileExist(hashPath)) {
        util.log(util.colors.yellow('[warning] hash file is not exist.'));
        return;
    }

    fs.unlinkSync(hashPath);
    util.log(util.colors.green('[log] flushing hash was completed!'));
}
