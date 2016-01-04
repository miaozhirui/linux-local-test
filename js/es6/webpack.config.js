module.exports = {
    entry: {'1':'./src/1'},
    output: {
        filename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /(node_modules|bower_components)/,
            query: {
                presets: ['es2015'],
                // cacheDirectory: true
            }
        }]
    },
    resolve: {
        extensions: ['.js'],
        charset: "utf-8"
    }
}
