module.exports = function (config) {
  config.set({
    browsers     : ['Chrome', 'Firefox'],
    // base path that will be used to resolve all patterns (e.g. files, exclude)
    basePath: '',
    frameworks   : ['jasmine', 'source-map-support'],
    exclude: [ ],
    files        : [{pattern: './karma-test-runner.js', watched: false}],
    preprocessors: {'./karma-test-runner.js': ['webpack'] },
    webpack      : require('./webpack.test.config.js'),

    // webpackMiddleware: {
    //   stats: 'errors-only'
    // },

    webpackServer: { noInfo: true },

    coverageReporter: {
        dir: 'coverage',
        reporters: [
            {
                type: 'json',
                subdir: '.',
                file: 'coverage.json'
            }
        ]
    },

    reporters: ['progress', 'mocha', 'coverage'],

    // web server port
    // port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    singleRun    : true
  });
};
