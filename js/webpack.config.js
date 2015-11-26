var path = require('path');
var webpack = require("webpack");

module.exports = {
    entry: ['./app/main.js'],
    devtool: 'source-map',
    resolve: {
        root: [path.join(__dirname, "node_modules")],
        extensions: ['', '.js', '.json', '.less', 'css']
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new webpack.optimize.CommonsChunkPlugin('common.bundle.js')
    ],
    output: {
        path: './build',
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'jsx-loader'
        }, {
            test: /\.less/,
            loader: 'style-loader!css-loader!less-loader'
        }, {
            test: /\.css/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }]
    }
};
