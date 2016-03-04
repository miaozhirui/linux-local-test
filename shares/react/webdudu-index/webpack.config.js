var HtmlWebpackPlugin = require('html-webpack-plugin');

function getDate(){
	var date = new Date();
	return date.getFullYear()+'_'+(date.getMonth()+1) + '_' + date.getDay()+'_'+(date.getHours());
}

var debug = false;

var config = {
	entry: './src/main.js',
	output: {
		// path: './build/',
		filename: '[hash].build.js'
		// filename: getDate() + '_build.js',
		// publicPath: debug ? '' : 'http://cdn.com'
	},
	devServer: {
		port: 7777,
		inline: true
	},
	devtool: 'source-map',

	module:{
		loaders:[
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets:['es2015','react']
				}
				
			},
			{
				test: /\.less$/,
				loader: "style!css!less"
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'url?limit=40000'
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
        	title: 'Custom template',
        	template: './src/tpl/index.html',
            filename: './index.html',
            inject: 'body',
            // chunks: ['vendors']
        }),
	]
}

module.exports = config;