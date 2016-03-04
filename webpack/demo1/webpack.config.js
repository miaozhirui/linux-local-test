var uglifyJsPlugin = require("./node_modules/webpack/lib/optimize/UglifyJsPlugin");
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var debug = true;

function getDate(){
	var date = new Date();
	return date.getFullYear()+'-'+(date.getMonth()+1) + '-' + date.getDay()+'-'+(date.getHours());
}

var config = {
    // 入口文件
    entry: './source/main.js',
    // 输出文件
    output: {
        path:'./build',
        filename: getDate()+'.build.js',
        publicPath: debug ? '/build/' : 'http://cdn.site.com'
    },
    // 配置模块信息
    module: {
        // 加载项
        loaders: [{
            test: /\.js$/,
            loader: "babel",
            query: {
                presets: ['es2015']
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: "style!css",

        }]
    },
    // 跟中源码报错的地方
    devtool: 'source-map',
    // 开启热部署
    devServer: {
        inline: true,
        port: '7777'
    },
    // 插件
    plugins: [
    //     // new uglifyJsPlugin({
    //     //     compress: {
    //     //         warnings: false
    //     //     }

    //     // }),
        // new HtmlWebpackPlugin()
        new HtmlWebpackPlugin({
        	title: 'Custom template',
        	template: './tpl/index.html',
            filename: 'index.html',
            inject: 'body',
            // chunks: ['vendors']
        }),
        new webpack.BannerPlugin('This file is created by miaozhirui')
    ]
}

module.exports = config;
