#!/usr/bin/env bash

echo "Before script - OS is $TRAVIS_OS_NAME"

echo "Setting xvfb based on TRAVIS_OS_NAME"
# setting xvfb on Linux https://docs.travis-ci.com/user/gui-and-headless-browsers/#Using-xvfb-to-Run-Tests-That-Require-a-GUI
if [[ $TRAVIS_OS_NAME == 'linux' ]]; then
    export DISPLAY=:99.0
    echo "DISPLAY is $DISPLAY"
    sh -e /etc/init.d/xvfb start
    sleep 3 # give xvfb some time to start
else
    echo "Installing cask on $TRAVIS_OS_NAME"
    brew tap caskroom/cask
    echo "Installing chrome on $TRAVIS_OS_NAME"
    brew cask install google-chrome
    echo "Installing firefox on $TRAVIS_OS_NAME"
    brew cask install firefox

    echo "Installing mongodb on $TRAVIS_OS_NAME"
    brew install mongodb --with-openssl
    #create a folder for mongodb to prevent an error on mac osx
    sudo mkdir -p /data/db

    echo "Installing redis on $TRAVIS_OS_NAME"
    wget http://download.redis.io/redis-stable.tar.gz
    tar xvzf redis-stable.tar.gz
    cd redis-stable
    make install
    cd ..
    rm -rf redis-stable
    rm -f redis-stable.tar.gz
fi
