var config = {
    entry: './main.js',
    output: {
        path: './',
        filename: 'build.js'
    },
    devServer: {
        inline: true,
        port: 7778
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_module/,

            loader: 'babel',

            query: {
                presets: ['es2015', 'react']
            }
        }]
    }


}


module.exports = config;
