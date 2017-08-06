
var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');

const exec = require('child_process').execSync;
const sourceFiles = 'src/**/*.ts';

const destination = './build';

gulp.task('default', function() {
    return gulp.src(sourceFiles)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write({
            sourceRoot: function(file) {
                var sourceFile = path.join(file.cwd, file.sourceMap.file);
                return path.relative(path.dirname(sourceFile), file.cwd);
            }
        }))
        .pipe(gulp.dest(destination));
});

gulp.task('watch', ['default'], function() {
    gulp.watch(sourceFiles, ['default'])
});