#!/usr/bin/env bash

echo "Before script - OS is $TRAVIS_OS_NAME"

echo "Setting xvfb"
# setting xvfb on Linux
if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    echo "Do nothing - because OS is $TRAVIS_OS_NAME"
else
    export DISPLAY=:99.0
    sh -e /etc/init.d/xvfb start
    sleep 3 # give xvfb some time to start
fi
