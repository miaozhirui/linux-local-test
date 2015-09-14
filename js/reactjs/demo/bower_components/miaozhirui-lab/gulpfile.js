var gulp = require('gulp'),
mincss = require('gulp-minify-css'),
sourcemaps = require('gulp-sourcemaps'),
clean = require('gulp-clean'),
copy = require('gulp-copy'),
uglify = require('gulp-uglify');


var src_js='./js',
target_js = './gulp/js',
src_css = './css',
target_css = './gulp/css';

gulp.task('mincss', function(){
   gulp.src(src_css+'/**/*.css')
            .pipe(mincss())
            .pipe(gulp.dest(target_css));
})
gulp.task('minjs',function() {
    gulp.src(src_js+'/**/*.js')
            .pipe(uglify({mangle:{except:['require']}}))
            .pipe(gulp.dest(target_js));
})
gulp.task('clean', function() {
    gulp.src('gulp')
            .pipe(clean());
})
gulp.task('copy', function() {
    gulp.src('./img/**/*')
            .pipe(gulp.dest('gulp/img'));
})
gulp.task('default', ['mincss','minjs','copy'])