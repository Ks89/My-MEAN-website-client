const webpack               = require('webpack');
const DefinePlugin          = require('webpack/lib/DefinePlugin');
const CommonsChunkPlugin    = require('webpack/lib/optimize/CommonsChunkPlugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');

const ENV  = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3100;

const metadata = {
  baseUrl: '/',
  ENV    : ENV,
  host   : HOST,
  port   : PORT
};

module.exports = webpackMerge(commonConfig, {
  devServer: {
    contentBase: './',
    historyApiFallback: true,
    stats: { colors: true },
    quiet: true,
    proxy: {
      "**": "http://localhost:3000"
    },

  },
  devtool: 'source-map',
  output: {
    path    : '/',
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills'],
      minChunks: Infinity
    }),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}}),
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        port: 3100,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on http://localhost:3100/)
        // through BrowserSync
        proxy: 'http://localhost:8080/'
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: false
      }
    )
  ]
});
