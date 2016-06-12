//jshint strict: false
exports.config = {

  allScriptsTimeout: 11000,

  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:3001/',

  framework: 'jasmine',

  seleniumAddress: 'http://localhost:4444/wd/hub',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }

};