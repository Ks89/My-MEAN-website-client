const path                  = require('path');
const webpack               = require('webpack');
const CommonsChunkPlugin    = require('webpack/lib/optimize/CommonsChunkPlugin');
const CompressionPlugin     = require('compression-webpack-plugin');
const CopyWebpackPlugin     = require('copy-webpack-plugin');
const DedupePlugin          = require('webpack/lib/optimize/DedupePlugin');
const DefinePlugin          = require('webpack/lib/DefinePlugin');
const OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
const ProvidePlugin         = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin        = require('webpack/lib/optimize/UglifyJsPlugin');
var HtmlWebpackPlugin       = require('html-webpack-plugin');
var ManifestPlugin          = require('webpack-manifest-plugin');
// var ChunkManifestPlugin           = require('chunk-manifest-webpack-plugin');
var InlineManifestWebpackPlugin   = require('inline-manifest-webpack-plugin');
var WebpackMd5HashPlugin          = require('webpack-md5-hash');
const autoprefixer = require('autoprefixer');

const ENV = process.env.NODE_ENV = 'production';
const metadata = {
  baseUrl: '/',
  ENV    : ENV
};

module.exports = {
  devtool: 'source-map',
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'main'  : './src/main.ts'
  },
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
        //, exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      ]},
      {test: /\.woff$/,  loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.woff2$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
      {test: /\.ttf$/,   loader: 'url?limit=10000&mimetype=application/octet-stream'},
      {test: /\.svg$/,   loader: 'url?limit=10000&mimetype=image/svg+xml'},
      {test: /\.eot$/,   loader: 'file'},

      // Bootstrap 4
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' }
    ],
    noParse: [path.join(__dirname, 'node_modules', 'angular2', 'bundles')]
  },
  output: {
    path    : './',
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: './'
  },
  postcss: [autoprefixer],
  plugins: [
    new CommonsChunkPlugin({
      name: ['main', 'vendor', 'polyfills'],
      minChunks: Infinity
    }),
    new WebpackMd5HashPlugin(),
    new ManifestPlugin(),
    new InlineManifestWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'My MEAN Website',
      template: './src/index.ejs', // Load a custom template
      inject: true
    }),

    // new ChunkManifestPlugin({ //BROKEN WITH WEBPACK 2
    //   filename: "manifest.json",
    //   manifestVariable: "webpackManifest"
    // }),

    new CompressionPlugin({regExp: /\.css$|\.html$|\.js$|\.map$/}),
    // new CopyWebpackPlugin([{from: './src/index.html', to: 'index.html'}]),

    // new DedupePlugin(),  //BROKEN WITH ANGULAR 2 RC6 OR HIGHER
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}}),

    new OccurrenceOrderPlugin(true),
    new UglifyJsPlugin({
      compress: {screw_ie8 : true},
      mangle: {screw_ie8 : true}
    }),

    new ProvidePlugin({
      jQuery: 'jquery',
      jquery: 'jquery',
      $: 'jquery',
      "Tether": 'tether',
      "window.Tether": "tether",
      //---------------------------------------------------
      //------------- temporary workaround ----------------
      // https://github.com/shakacode/bootstrap-loader/issues/172#issuecomment-247205500
      //this requires exports-loader installed from npm
      Tooltip: "exports?Tooltip!bootstrap/js/dist/tooltip",
      Alert: "exports?Alert!bootstrap/js/dist/alert",
      Button: "exports?Button!bootstrap/js/dist/button",
      Carousel: "exports?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports?Modal!bootstrap/js/dist/modal",
      Popover: "exports?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports?Tab!bootstrap/js/dist/tab",
      Util: "exports?Util!bootstrap/js/dist/util"
      //---------------------------------------------------
    })
    ],
    resolve: {
      extensions: ['', '.ts', '.js', '.json', '.css', '.html']
    }
  };
