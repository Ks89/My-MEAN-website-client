const webpack               = require('webpack');
const DefinePlugin          = require('webpack/lib/DefinePlugin');
const CommonsChunkPlugin    = require('webpack/lib/optimize/CommonsChunkPlugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');

const ENV  = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const METADATA = {
  contentBase: './',
  env: ENV,
  host: HOST,
  portServer: '3000',
  portWebpackDevServer: PORT,
  portBrowserSync: '3100',
};

const MAIN_SERVER_PATH = `http://${METADATA.host}:${METADATA.portServer}`;
const DEV_SERVER_PATH = `http://${METADATA.host}:${METADATA.portWebpackDevServer}`;

module.exports = webpackMerge(commonConfig, {
  devServer: {
    contentBase: METADATA.contentBase,
    historyApiFallback: true,
    stats: { colors: true },
    quiet: true,
    proxy: {
      //proxy all paths of the main server (executed with gulp/nodemon)
      "**": MAIN_SERVER_PATH
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
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(METADATA.env)}}),
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        // browse to http://${METADATA:host}:${METADATA.portBrowserSync}/
        // during development
        host: METADATA.host,
        port: METADATA.portBrowserSync,
        // proxy the Webpack Dev Server endpoint
        // (which should be serving on DEV_SERVER_PATH) through BrowserSync
        proxy: DEV_SERVER_PATH
      },
      // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        // (usefull if you want to use HMR)
        reload: false
      }
    )
  ]
});
