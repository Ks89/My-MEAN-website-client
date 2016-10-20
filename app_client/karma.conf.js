module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks   : ['jasmine'],
    files        : [{pattern: './karma-test-runner.js', watched: false}],
    preprocessors: {'./karma-test-runner.js': ['coverage', 'webpack', 'sourcemap']},
    webpack      : require('./webpack.test.config'),

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: { noInfo: true },

    coverageReporter: {
        type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      'json': './coverage/coverage.json',
      'html': './coverage/html',
      'lcovonly': './coverage/lcov.info'
    },

    reporters: ['progress', 'mocha', 'coverage', 'remap-coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers     : ['PhantomJS', 'Chrome', 'Firefox'],
    singleRun    : true
  });
};
