const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    output: {
        filename: '[name].min.js',
        path: path.join(__dirname, "dist"),
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: 'pg-test',
    },
    entry: { "pg-test": "./src/app.ts" },
    resolve: {
        extensions: [".ts"]
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    /node_modules/
                ]
            }
        ]
    },
    externals: [nodeExternals()],
    devtool: "source-map",
    optimization: {
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
            }),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            PRODUCTION: '"false"'
        })
    ]
};
