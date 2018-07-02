"use strict";

// Config file for Gulp
const config = require('./gulpconfig.json');

// Load plugins
const gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins = gulpLoadPlugins(),
    sass = require('gulp-sass'),
    del = require('del'),
    yargs = require('yargs').argv,
    minify = !!yargs.minify;

// Deletes the build directory
function clean() {
    return del(config.path.build.root);
}

// Compiles and minifies HTML of nunjucks, outputs it in /build
function html() {
    return gulp.src(config.path.src.htmlIndex)
        .pipe(plugins.nunjucks.compile())
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(config.path.build.root))
        .pipe(plugins.size({title: '--> HTML'}));
}

// Optimizes images, outputs it in /build/images
function images() {
    return gulp.src(config.path.src.images)
        .pipe(plugins.imagemin([
            plugins.imagemin.gifsicle({interlaced: true}),
            plugins.imagemin.jpegtran({progressive: true}),
            plugins.imagemin.optipng({optimizationLevel: 5})]))
        .pipe(gulp.dest(config.path.build.images))
        .pipe(plugins.size({title: '--> Images'}));
}

// Copies the sounds directory from /src/sounds to /build/sounds
function sounds() {
    return gulp.src(config.path.src.sounds)
        .pipe(gulp.dest(config.path.build.sounds))
        .pipe(plugins.size({title: '--> Sounds'}));
}

// Compiles SASS into CSS, auto prefixes if necessary, and minifies CSS if --minify is used
// Renames it eventually to main.min.css, outputs it in build/css
function styles() {
    return gulp.src(config.path.src.styles)
        .pipe(plugins.sass().on('error', sass.logError))
        .pipe(plugins.autoprefixer(config.path.autoprefixer.split(', ')))
        .pipe(plugins.if(minify, plugins.cssnano()))
        .pipe(plugins.rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(config.path.build.styles))
        .pipe(plugins.size({title: '--> CSS'}));
}

// Enables sourcemaps, uglifies if --minify is used, concats all the files in /src/js,
// renames it to main.min.js, outputs it in build/js
function scripts() {
    return gulp.src(config.path.src.scripts, {sourcemaps: true})
        .pipe(plugins.if(minify, plugins.uglify()))
        .pipe(plugins.concat('main.min.js'))
        .pipe(gulp.dest(config.path.build.scripts))
        .pipe(plugins.size({title: '--> Scripts'}));
}

// Watches html, images, scripts, styles folders for changes
function watch() {
    gulp.watch(config.path.src.html, html);
    gulp.watch(config.path.src.images, images);
    gulp.watch(config.path.src.scripts, scripts);
    gulp.watch(config.path.src.styles, styles);
}

// Export functions for reusing it in the gulp.series
exports.clean = clean;
exports.html = html;
exports.images = images;
exports.sounds = sounds;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;

// Here the exported functions are being used with shorthand commands
// c = clean, b = build, w = watch
const __c = gulp.series(clean);
const __cb = gulp.series(clean, gulp.parallel(html, images, sounds, styles, scripts));
const __cbw = gulp.series(clean, gulp.parallel(html, images, sounds, styles, scripts), watch);
const __b = gulp.parallel(html, images, sounds, styles, scripts);
const __bw = gulp.series(gulp.parallel(html, images, sounds, styles, scripts), watch);

// The tasks defined, based on the clean/build/watch constants (above)
// Usage: gulp c, gulp cb, gulp cbw, gulp b, gulp bw
gulp.task('c', __c);
gulp.task('cb', __cb);
gulp.task('cbw', __cbw);
gulp.task('b', __b);
gulp.task('bw', __bw);