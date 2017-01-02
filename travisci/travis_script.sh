#!/usr/bin/env bash

# run debug build
echo "npm run debug build on $TRAVIS_OS_NAME"
npm run buildDev
# run production build
echo "npm run production build on $TRAVIS_OS_NAME"
npm run build
# run test
echo "npm run test on $TRAVIS_OS_NAME"
npm test

# send test coverage to codeclimate.com
echo "npm run codeclimate on $TRAVIS_OS_NAME"
npm run codeclimate
# send test coverage to coveralls.io
echo "npm run coveralls on $TRAVIS_OS_NAME"
npm run coveralls