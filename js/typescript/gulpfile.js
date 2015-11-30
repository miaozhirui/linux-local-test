var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    watch = require('gulp-watch');
  

gulp.task('typescript', function(){
    gulp.src('./ts/**/*.ts')
        .pipe(ts())
        .pipe(gulp.dest('./js/'));
})

// 监听less文件的变化
gulp.task('watch', function() {
    watch('./ts/**/*.ts', function() {
        gulp.start('typescript')
    })
})


