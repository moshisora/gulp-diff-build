'use strict';

const util = require('gulp-util');
const through = require('through2');
const fs = require('fs');
const crypto = require('crypto');
const mkdirp = require('mkdirp');
const path = require('path');

const SETTING = {
    path: '.gulp/gulp-diff-build/',
    hash: '.gulp/gulp-diff-build/hash.json'
};

module.exports = function (options) {
    options = options || {};

    let destFiles = [],
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
    if (options.clearAll === true) flushHashAll();

    if (isExist(hashPath)) {
        cached = JSON.parse(fs.readFileSync(hashPath, 'utf8'));
    } else {
        hasDiff = true;
    }

    return through.obj(function(file, encoding, callback)
    {
        if ( file.isNull() ) callback(null,file);
        else {
            if ( file.isBuffer() ) transform(file, encoding, callback);
            if ( file.isStream() )
            {
                file.contents.pipe(through(function(chunk,enc,cb){
                    file.contents = chunk;
                    transform(file, encoding, callback);
                    cb();
                }));
            }
        }
    }
    ,flush);

    function transform(file, encoding, callback) {
        let filename = path.relative(file.cwd, file.path);

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
        let me = this,
            hash = cached;

        if (sizeOfHash(cached) != hashPaths.length) {
            hasDiff = true;
        }

        if (hasDiff) {
            util.log(util.colors.green('[diff log] Changes detected.'));

            Array.from(hashFiles).forEach(function (file, index) {
                let filename = hashPaths[index];
                hash[filename] = sha1(file.contents);
            });
            mkdirp.sync(hashPath.replace(/[^\/]+\.json$/, ''));
            fs.writeFileSync(hashPath, JSON.stringify(hash), {
                encoding: 'utf8',
            });

            Array.from(destFiles).forEach(function (file, index) {
                me.push(file);
            });
        } else {
            util.log(util.colors.green('[diff log] No changes.'));
        }
        callback();
    }
};

function sha1(buf) {
    return crypto.createHash('sha1').update(buf).digest('hex');
}

function isExist(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') return false;
    }
}

function flushHash(hashPath) {
    util.log('[diff log] flushing hash...');

    if (!isExist(hashPath)) {
        util.log(util.colors.yellow('[diff warning] hash file does not exist.'));
        return;
    }

    fs.unlinkSync(hashPath);
    util.log(util.colors.green('[diff log] flushing hash completed!'));
}

function flushHashAll() {
    util.log('[diff log] flushing all hashes...');

    if (!isExist(SETTING.path)) {
        util.log(util.colors.yellow('[diff warning] hash files does not exist.'));
        return;
    }

    let targetFiles = fs.readdirSync(SETTING.path);

    if (!targetFiles.length) {
        util.log(util.colors.yellow('[diff warning] hash files is empty.'));
        return;
    }

    Array.from(targetFiles).forEach(function (file, index) {
        fs.unlinkSync(SETTING.path + file);
    });
    util.log(util.colors.green('[diff log] flushing hashes completed!'));
}

function sizeOfHash(hash) {
    var size = 0;

    for (var i in hash) {
        size++;
    }

    return size;
}
