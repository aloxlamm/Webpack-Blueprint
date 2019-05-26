const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const paths = {
    PUBLIC: path.resolve(__dirname, 'public'),
    SRC: path.resolve(__dirname, 'src'),
    JS: path.resolve(__dirname, 'src/js'),
};


module.exports = {
    mode: 'development',
    entry: {
        app: path.join(paths.JS, 'App.js')
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'Crumbl_OS.js'
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
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            publicPath: '../',
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
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
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'main.css',
            chunkFilename: '[id].css',
        }),
        new CopyWebpackPlugin([
            {
                //Note:- No wildcard is specified hence will copy all files and folders
                from: 'src/assets', //Will resolve to RepoDir/src/assets 
                to: 'assets' //Copies all files from above dest to dist/assets
            },
            {
                //Wildcard is specified hence will copy only css files
                from: 'src/css/*.css', //Will resolve to RepoDir/src/css and all *.css files from this directory
                to: 'css'//Copies all matched css files from above dest to dist/css
            }
        ])
    ]
}