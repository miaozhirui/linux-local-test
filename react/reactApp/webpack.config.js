var config = {
	entry: './main.js',
	output: {
		path: './',
		filename: 'build.js',
	},

	devServer: {
		inline: true,
		port: 8888
	},
	module: [
		
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel',

				query: {
					presets: ['es2015', 'react']
				}
			}
	]
}

module.exports = config;