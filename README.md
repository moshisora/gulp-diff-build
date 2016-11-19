## gulp-diff-build

gulp module to stream files only if target files are changed.

## Usage

This task will keep a hash reference of target files and run defined tasks only if files changed.
File hashes will be saved in .gulp/gulp-diff-build/hash.json. You might like to add .gulp to your .gitignore.

```javascript
const diff = require('./diff');

const SRC = 'src';
const DEST = 'dist';

gulp.task('default', () => {
    gulp.src(SRC)
        .pipe(diff())
        .pipe(gulp.dest(DEST));
});
```

## Options

### clear

Type: `bool`

flush file hashes running with clear option value: `true`

### dest

Type: `string` or `array`

option to filter streaming files. This task will stream only files that match given paths into the gulp stream.

## Example

example of building sass.

gulp task watch all of sass src files and stream only `main.sass` and `main-sp.sass` into `sass()` task.

```javascript
const diff = require('./diff');

gulp.task('default', () => {
    gulp.src('src/sass/**/*.sass')
        .pipe(diff({
            clean: true,
            dest: [
                'src/sass/main.sass',
                'src/sass/main-sp.sass'
            ]
        }))
        .pipe(sass()),
        .pipe(gulp.dest('dest'));
});
```

## License

The MIT License (MIT)

Copyright 2016~ moshisora
