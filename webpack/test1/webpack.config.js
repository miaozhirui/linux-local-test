var webpack = require('webpack');

module.exports = {
	entry: './entry.js',
	output: {
		path: __dirname,//定义了输出的文件夹
		filename: 'bundle.js'//定义了打包过后的文件名称
	},
	//定义了对模块的处理逻辑
	module: {
		loaders: [
			{
				// 当加载test对应的指定的文件类型的时候，就会用对应的loader进行处理
				test: /\.css$/ , loader: "style!css"
			},
			{
				test: /\.(png|jpg)$/, loader: "url?limit=40000"
			}
		]
	},
	// 插件的使用
	plugins: [
	 new webpack.BannerPlugin('This file is created by miaozhirui')
	],
	resolve: {
		alias: {
			jquery: './js/jquery.js'
		}
	}
}