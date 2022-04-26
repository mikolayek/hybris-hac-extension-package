/* eslint-disable no-undef */
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    entry: './src/js/main.js',
    devtool: 'source-map',
    plugins: [new ESLintPlugin()],
    output: {
        path: __dirname + '/static',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
};