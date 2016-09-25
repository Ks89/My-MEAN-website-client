const DefinePlugin = require('webpack/lib/DefinePlugin');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.config.js');

const ENV  = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const metadata = {
  env : ENV,
  host: HOST,
  port: PORT
};

module.exports = webpackMerge(commonConfig, {
  debug: true,
  devtool: 'source-map',
  output: {
    path    : './',
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: './'
  },
  plugins: [
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}})
  ]
});
