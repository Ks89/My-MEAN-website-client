const webpack               = require('webpack');
const path                  = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin         = require('webpack/lib/ProvidePlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const ENV  = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;

const metadata = {
  env : ENV,
  host: HOST,
  port: PORT
};

module.exports = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.css', '.scss', 'json', '.html']
  },
  module: {
    rules: [
      // Instanbul
      {
        enforce: 'post',
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        include: './src',
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      },
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader'
        ],
        // DON'T USE THIS WITH TESTS -> exclude: [/\.(spec|e2e)\.ts$/]
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
    ]
  },
  plugins: [
    new DefinePlugin({'webpack': {'ENV': JSON.stringify(metadata.ENV)}}),
    new LoaderOptionsPlugin({
      debug: true
    }),
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      path.join(__dirname, 'src') // location of your src
    )
  ]
}
