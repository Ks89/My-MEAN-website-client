const path         = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');

const ENV  = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const metadata = {
  env : ENV,
  host: HOST,
  port: PORT
};

module.exports = {
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.css$/,   loader: 'raw', exclude: /node_modules/},
      {test: /\.css$/,   loader: 'style!css?-minimize', exclude: /src/},
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['raw-loader', 'sass-loader']
      },
      {test: /\.html$/,  loader: 'raw'},
      {test: /\.ts$/,   loaders: [
        {loader: 'ts', query: {compilerOptions: {noEmit: false}}},
        {loader: 'angular2-template'}
      ]},
      {test: /\.woff$/,  loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.woff2$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf$/,   loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg$/,   loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /\.eot$/,   loader: 'file'}
    ]
  },
  plugins: [
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.env)}}),
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
