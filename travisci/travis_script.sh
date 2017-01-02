#!/usr/bin/env bash

# run debug builf
npm run buildDev
# run production build
npm run build
# run test
npm test

# send test coverage to codeclimate.com
npm run codeclimate
# send test coverage to coveralls.io
npm run coveralls