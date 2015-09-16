var react = require('gulp-react');
var gulp = require('gulp');
var watch = require('gulp-watch');

gulp.task('react', function(){
	gulp.src('./index.jsx')
	 .pipe(react())
	 .pipe(gulp.dest('./index1.js'));
})

gulp.task('watch', function(){
	watch('index.jsx', function(){
		gulp.start(['react'])
	});
})