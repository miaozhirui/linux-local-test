var DEBUG = true;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
	entry: [
		'./app/main.js'
	],
	output:{
		path:__dirname + '/dist/',
		publicPath: DEBUG ? '/dist/' : '//aliyun.com',//html里面引用的地址，也可以是cdn里面的地址
		filename: 'bundle.js?v=[chunkhash]'
	},
	module:{
		loaders:[{
			test: /\.less$/, 
			loader: 'style-loader!css-loader!less-loader'
		},{
			test: /\.(png|jpe?g)$/,
			loader: 'url-loader?limit=1024*10&name=img/[name].[ext]'
		},{
			test: /\.jsx?$/, 
			loader: 'babel-loader'
		},
		{
			test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") 
		}
		],
		noParse: [/moment-with-locales/]
	},
	resolve:{
		extension: ['.js', '.less', '.css'],
		alias: {
			// moment: 'moment/min/moment-with-locales.min.js'
		}
	},
	plugins: [
		// new ExtractTextPlugin(__dirname + '/dist/styles.css')
		new ExtractTextPlugin('/styles.css')
	]
}