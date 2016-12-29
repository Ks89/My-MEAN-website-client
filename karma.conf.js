'use strict';

const webpackConfig = require('./config/webpack.test');

function getBrowsers() {
  if (process.env.CI) {
    if(process.env.APPVEYOR) {
      // only for AppVeyor
      return ['Chrome'];
    } else {
      return ['PhantomJS'];
    }
  } else {
    return ['PhantomJS', 'Chrome', 'Firefox'];
  }
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      "./config/karma-test-runner.js"
    ],
    // files: [
    //   {
    //     pattern: './config/karma-test-runner.js',
    //     watched: false
    //   }
    // ],
    exclude: [],
    preprocessors: {
      './config/karma-test-runner.js': ['coverage', 'webpack', 'sourcemap']
    },
    webpack: webpackConfig,

    webpackMiddleware: {
      stats: {
        chunks: false
      }
      // stats: 'errors-only'
    },

    reporters: ['progress', 'mocha', 'kjhtml', 'coverage', 'remap-coverage'],


    // webpackServer: {noInfo: true},

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: getBrowsers(),
    singleRun: true,

    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      'json': './coverage/coverage.json',
      'html': './coverage/html',
      'lcovonly': './coverage/lcov.info'
    },
    jasmineDiffReporter: {
      multiline: true
    }

    // For AppVeyor to prevent timeouts
    // removed because I switched to Chrome for AppVeyor
    //browserNoActivityTimeout: 60000,
    //browserDisconnectTimeout: 60000,
    //browserDisconnectTolerance: 10
  });
};
