module.exports = function (config) {
  config.set({
    browsers     : ['Chrome', 'Firefox'],
    frameworks   : ['jasmine'],
    reporters    : ['mocha', 'progress', 'coverage' ],
    coverageReporter: {
            dir: 'build/reports/coverage',
            reporters: [
                {
                    type: 'html',
                    subdir: 'report-html'
                },
                {
                    type: 'lcov',
                    subdir: 'report-lcov'
                },
                {
                    type: 'cobertura',
                    subdir: '.',
                    file: 'cobertura.txt'
                }
            ]
        },
    singleRun    : true,
    preprocessors: {'./karma-test-runner.js': ['webpack']},
    files        : [{pattern: './karma-test-runner.js', watched: false}],
    webpack      : require('./webpack.test.config.js'),
    webpackServer: {noInfo: true}
  });
};
