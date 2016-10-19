const webpack = require('webpack');
const path = require('path');

const helpers = require('./webpack.helpers');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
    modules: ['node_modules', helpers.root('src')]
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        enforce: 'post',
        loader: 'istanbul-instrumenter-loader',
        include: helpers.root('src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          module: 'commonjs',
          sourceMap: false,
          inlineSourceMap: true
        }
      },
      {
        test: /\.ts$/,
        loader: 'angular2-template-loader'
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)/,
        loader: 'null'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: 'null'
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['raw-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('./src') // location of your src
    )
  ]
}
