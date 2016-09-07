const path = require('path');

// Webpack and its plugins
const webpack              = require('webpack');
const CommonsChunkPlugin   = require('webpack/lib/optimize/CommonsChunkPlugin');
const CompressionPlugin    = require('compression-webpack-plugin');
const CopyWebpackPlugin    = require('copy-webpack-plugin');
const DedupePlugin         = require('webpack/lib/optimize/DedupePlugin');
const DefinePlugin         = require('webpack/lib/DefinePlugin');
const OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
const ProvidePlugin        = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin       = require('webpack/lib/optimize/UglifyJsPlugin');

const ENV = process.env.NODE_ENV = 'production';
const metadata = {
  baseUrl: '/',
  ENV    : ENV
};

module.exports = {
  debug: false,
  devtool: 'source-map',
  entry: {
    'main'  : './app/main.ts',
    'vendor': './app/vendor.ts'
  },
  metadata: metadata,
  module: {
    loaders: [
      // {test: /\.css$/,   loader: 'raw', exclude: /node_modules/},
      // {test: /\.css$/,   loader: 'style!css?-minimize', exclude: /app/},



      //{test: /\.css$/,   loader: 'to-string!css', exclude: /node_modules/},
      {test: /\.css$/,   loader: 'raw', exclude: /node_modules/},

      {test: /\.css$/,   loader: 'style!css', exclude: /app/},
      {test: /\.css$/,   loader: 'style-loader!css-loader'},
      {test: /\.html$/,  loader: 'html?caseSensitive=true'},
      {test: /\.ts$/,    loader: 'ts', query: {compilerOptions: {noEmit: false}}},
      {test: /\.woff$/,  loader: "url?limit=10000&minetype=application/font-woff"},
      {test: /\.woff2$/, loader: "url?limit=10000&minetype=application/font-woff"},
      {test: /\.ttf$/,   loader: "url?limit=10000&minetype=application/octet-stream"},
      {test: /\.svg$/,   loader: "url?limit=10000&minetype=image/svg+xml"},
      {test: /\.eot$/,   loader: "file"}
    ]
  },
  output: {
    path    : '../',
    filename: 'bundle.js'
  },
  plugins: [
    new CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js', minChunks: Infinity}),
    new CompressionPlugin({regExp: /\.css$|\.html$|\.js$|\.map$/, threshold: 1500}),
    new CopyWebpackPlugin([{from: './index.html', to: 'index.html'}]),
    new DedupePlugin(),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}}),
    new OccurenceOrderPlugin(true),
    new UglifyJsPlugin({
      compress : {screw_ie8 : true},
      mangle: {screw_ie8 : true }
    }),
    new ProvidePlugin({
      jQuery: 'jquery',
      jquery: 'jquery',
      $: 'jquery',
      "Tether": 'tether',
      "window.Tether": "tether"})
  ],
  resolve: {
    extensions: ['', '.ts', '.js']
  }
};
