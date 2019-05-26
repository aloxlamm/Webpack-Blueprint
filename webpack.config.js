const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const paths = {
    PUBLIC: path.resolve(__dirname, 'public-dev'),
    SRC: path.resolve(__dirname, 'src'),
    JS: path.resolve(__dirname, 'src/js'),
};

console.log(paths.JS)

module.exports = {
    mode: 'development',
    entry: {
        app: path.join(paths.JS, 'App.js')
    },
    output: {
        path: path.resolve(__dirname, 'public-dev'),
        filename: 'App.js'
    },
    devServer: {
        contentBase: paths.PUBLIC,
        hot: true,
        port: 8080
    },
    devtool: 'eval',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader',
                ],
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'main.css',
            chunkFilename: '[id].css',
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/images', 
                to: 'images'
            },
            {
                from: 'src/static-data', 
                to: 'static-data'
            },
            {
                from: 'src/fonts', 
                to: 'fonts'
            }
        ])
    ]
}