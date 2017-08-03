
var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

const exec = require('child_process').execSync;

const destination = './build';

gulp.task('default', function() {
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .js.pipe(gulp.dest(destination));
});

gulp.task('tests', ['default'], function() {
    return gulp.src('tests/**/*.ts')
        .pipe(tsProject())
        .js.pipe(gulp.dest(destination));
});