const webpack               = require('webpack');
const DefinePlugin          = require('webpack/lib/DefinePlugin');
const ProvidePlugin         = require('webpack/lib/ProvidePlugin');
const OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
var HtmlWebpackPlugin       = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin          = require('webpack-manifest-plugin');
var InlineManifestWebpackPlugin   = require('inline-manifest-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.css', '.html']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'tslint',
        enforce: 'pre'
      },
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
      {test: /\.eot$/,   loader: 'file'},

      // Bootstrap 4
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' }
    ],
    postLoaders: [
      {
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        include: './src',
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      }
    ]
    // noParse: [path.join(__dirname, 'node_modules', 'angular2', 'bundles')]
    // loaders: [
    //   {
    //     test: /\.ts$/,
    //     loaders: ['awesome-typescript-loader', 'angular2-template-loader']
    //   },
    //   {
    //     test: /\.html$/,
    //     loader: 'html'
    //   },
    //   {
    //     test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
    //     loader: 'file?name=assets/[name].[hash].[ext]'
    //   },
    //   {
    //     test: /\.css$/,
    //     exclude: helpers.root('src', 'app'),
    //     loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
    //   },
    //   {
    //     test: /\.css$/,
    //     include: helpers.root('src', 'app'),
    //     loader: 'raw'
    //   }
    // ]
  },
  plugins: [
    new ManifestPlugin(),
    new InlineManifestWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'My MEAN Website',
      template: './src/index.ejs', // Load a custom template
      inject: true
    }),
    new OccurrenceOrderPlugin(true),
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
    }),
    new LoaderOptionsPlugin({
      debug: true,
      options: {
        postcss: [autoprefixer],
        tslint: {
          emitErrors: false,
          failOnHint: false,
          resourcePath: 'src',
          formattersDirectory: "node_modules/tslint-loader/formatters/"
        }
      }
    })
  ]
};
