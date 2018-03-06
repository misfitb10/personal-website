var gulp = require('gulp');
var babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');

var paths = {
    html: {
        src: 'src/*.html',
        dest: 'build/'
    },
    styles: {
        src: 'src/scss/**/*.scss',
        dest: 'build/css/'
    },
    scripts: {
        src: 'src/js/*.js',
        dest: 'build/js/'
    }
};

function clean() {
    return del([ 'assets' ]);
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(paths.html.dest));
}

function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
    gulp.watch(paths.html.src, html);
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
}

var build = gulp.series(gulp.parallel(html, styles, scripts));
var watch = gulp.series(gulp.parallel(html, styles, scripts), watch);

gulp.task('build', build);
gulp.task('default', watch);
gulp.task('watch', watch);
