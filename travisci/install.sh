#!/bin/bash

echo "Install - OS is $TRAVIS_OS_NAME"

echo "Installing dependencies"
if [[ $TRAVIS_OS_NAME = 'osx' ]]; then
    echo "Installing $TRAVIS_OS_NAME local dependencies"
    npm install
else
    echo "Installing $TRAVIS_OS_NAME local dependencies"
    npm install
fi


# Installing server side local dependencies
npm --prefix ./My-MEAN-website-server/ install ./My-MEAN-website-server/

echo "Server-side's local dependencies installed"