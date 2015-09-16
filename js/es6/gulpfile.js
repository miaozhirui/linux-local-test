var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');


gulp.task('babel', function(){
	gulp.src('./src/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('build/'))
})


gulp.task('watch', function(){
	watch('src/**/*.js', function(){
		gulp.start(['babel'])
	})
})