var gulp = require('gulp'),
webpack = require('gulp-webpack'),
webpackConfig = require('./webpack.config.js');

gulp.task('webpack', function(){
	var config = Object.create(webpackConfig);

	gulp.src('./src')
		.pipe(webpack(config))
		.pipe(gulp.dest('./build/'))
})

gulp.task('copy', function(){

	gulp.src('./src/images/**/*')
		.pipe(gulp.dest('./build/src/images/'))
})


gulp.task('default', ['webpack', 'copy']);