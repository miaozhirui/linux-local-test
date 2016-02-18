var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var webpack = require('gulp-webpack');

var config = require('./webpack.config');


gulp.task('webpack', function(){
	gulp.src('./src/**/*.js')
		.pipe(webpack(config))
		.pipe(gulp.dest('./build/'))   
})


gulp.task('watch', function(){
	watch('src/**/*.js', function(){
		gulp.start(['webpack']) 
	})
})