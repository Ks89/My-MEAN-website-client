const path                  = require('path');
const webpack               = require('webpack');
const CommonsChunkPlugin    = require('webpack/lib/optimize/CommonsChunkPlugin');
const CompressionPlugin     = require('compression-webpack-plugin');
const DefinePlugin          = require('webpack/lib/DefinePlugin');
const UglifyJsPlugin        = require('webpack/lib/optimize/UglifyJsPlugin');
var ManifestPlugin          = require('webpack-manifest-plugin');
// var ChunkManifestPlugin           = require('chunk-manifest-webpack-plugin');
var WebpackMd5HashPlugin          = require('webpack-md5-hash');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');

const ENV = process.env.NODE_ENV = 'production';
const metadata = {
  baseUrl: '/',
  ENV    : ENV
};

module.exports = webpackMerge(commonConfig, {
  output: {
    path    : '',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    //publicPath: ''
  },
  plugins: [
    new CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills'],
      minChunks: Infinity
    }),
    new WebpackMd5HashPlugin(),
    // new ChunkManifestPlugin({ //BROKEN WITH WEBPACK 2
    //   filename: "manifest.json",
    //   manifestVariable: "webpackManifest"
    // }),

    new CompressionPlugin({regExp: /\.css$|\.html$|\.js$|\.map$/}),
    // new CopyWebpackPlugin([{from: './src/index.html', to: 'index.html'}]),

    // new DedupePlugin(),  //BROKEN WITH ANGULAR 2 RC6 OR HIGHER
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}}),

    new UglifyJsPlugin({
      compress: {screw_ie8 : true},
      mangle: {screw_ie8 : true}
    })
    ],
});
