/*
 * Copyright (C) 2015-2017 Stefano Cappa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const webpack                     = require('webpack');
const DefinePlugin                = require('webpack/lib/DefinePlugin');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const BrowserSyncPlugin           = require('browser-sync-webpack-plugin');
const webpackMerge                = require('webpack-merge');
const webpackMergeDll             = webpackMerge.strategy({plugins: 'replace'});
const ExtractTextPlugin           = require('extract-text-webpack-plugin');
const AutoDllPlugin               = require('autodll-webpack-plugin');

const commonConfig                = require('./webpack.common');
const helpers                     = require('./helpers');

const ENV = process.env.NODE_ENV = 'dev';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const METADATA = {
  env: ENV,
  host: HOST,
  portServer: '3000',
  portWebpackDevServer: PORT,
  portBrowserSync: '3300'
};

const MAIN_SERVER_PATH = `http://${METADATA.host}:${METADATA.portServer}`;
const DEV_SERVER_PATH = `http://${METADATA.host}:${METADATA.portWebpackDevServer}`;

module.exports = webpackMerge(commonConfig, {
  devtool: 'cheap-module-source-map',
  output: {
    path: helpers.root('dist'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    chunkFilename: '[name].js',
    publicPath: '/',
    library: 'ac_[name]',
    libraryTarget: 'var'
  },
  devServer: {
    hot: true, // MANDATORY FOR HMR
    inline: true,
    port: METADATA.portWebpackDevServer,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    },
    stats: {colors: true},
    proxy: {
      //proxy all paths of the main
      //server (executed with gulp (not with nodemon))
      "/api/**": MAIN_SERVER_PATH
    },

  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: [
          {
            loader: 'tslint-loader',
            options: {
              configFile: 'tslint.json'
            }
          }
        ],
        exclude: [/\.(spec|e2e)\.ts$/, /node_modules/]
      },

      /*
       * css loader support for *.css files (styles directory only)
       * Loads external css styles into the DOM, supports HMR
       */
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [helpers.root('src', 'styles')]
      },

      /*
       * sass loader support for *.scss files (styles directory only)
       * Loads external sass styles into the DOM, supports HMR
       */
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: [helpers.root('src', 'styles')]
      }
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(METADATA.env)}}),

    new AutoDllPlugin({
      debug: true,
      inject: true,
      context: __dirname,
      filename: '[name]_[hash].js',
      path: './dll',
      entry: {
        polyfills: [
          'core-js',
          'zone.js/dist/zone.js',
          'zone.js/dist/long-stack-trace-zone'
        ],
        vendor: [
          '@angular/animations',
          '@angular/platform-browser',
          '@angular/platform-browser-dynamic',
          '@angular/core',
          '@angular/common',
          '@angular/forms',
          '@angular/http',
          '@angular/router',
          '@angularclass/hmr',
          '@ngrx/store',
          '@ngrx/store-devtools',
          'rxjs',
          '@ng-bootstrap/ng-bootstrap',
          'style-loader',
          'jquery',
          'bootstrap-loader',
          'hammerjs',
          'lodash',
          'mousetrap',
          'ng2-validators',
          'reflect-metadata',
          'angular2-cookie-law',
          'tether'
        ]
      }
    }),

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
        // (useful if you want to use HMR)
        reload: false
      }
    ),
    new LoaderOptionsPlugin({
      debug: true,
      options: {}
    }),
  ],
  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
