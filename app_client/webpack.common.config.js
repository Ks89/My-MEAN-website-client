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
    descriptionFiles: ['package.json'],
    extensions: ['.ts', '.js', '.css', '.scss', 'json', '.html']
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint'
      },
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader'
        ],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
       test: /\.css$/,
       loader: 'raw-loader!style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['raw-loader', 'sass-loader']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      // Bootstrap 4
      // { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' },

      // Instanbul
      {
        enforce: 'post',
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        include: 'src',
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      }
    ]
    // noParse: [path.join(__dirname, 'node_modules', 'angular2', 'bundles')]
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
  ],

  node: {
     fs: 'empty',
     global: true,
     crypto: 'empty',
     module: false,
     clearImmediate: false,
     setImmediate: false
  }
};
