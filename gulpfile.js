/**
 * Created by jonas on 26.03.2017.
 */

var gulp = require('gulp');
var babel = require('gulp-babel');
var babelify = require('babelify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var vueify = require('vueify');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

gulp.task('javascript', function() {

    var b = browserify({
        entries: ['assets/js/Main.js']
    });

    return b
        .transform(vueify)
        .transform(babelify, {presets: ["es2015"]})
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(minify().on('error', gutil.log))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/assets/js'))
    ;
});

gulp.task('sass', function() {
    return gulp.src('assets/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({browsers: ['last 2 version']}),
            cssnano()
        ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/assets/css'))
    ;
});

gulp.task('default', ['javascript', 'sass']);