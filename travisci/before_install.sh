#!/bin/bash

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    sudo npm install -g karma-cli
    sudo npm install -g webpack@2.2.0-rc.2
    sudo npm install -g typescript@2.0.10
    sudo npm install -g typings
    sudo npm install -g remap-istanbul
    sudo npm install -g webdriver-manager
    sudo npm install -g protractor
    sudo npm install -g codeclimate-test-reporter
    sudo npm install -g istanbul
else
    export FIREFOX_BIN=$HOME/firefox-latest/firefox
    export PATH=$FIREFOX_BIN:$PATH
    npm install -g karma-cli
    npm install -g webpack@2.2.0-rc.2
    npm install -g typescript@2.0.10
    npm install -g typings
    npm install -g remap-istanbul
    npm install -g webdriver-manager
    npm install -g protractor
    npm install -g codeclimate-test-reporter
    npm install -g istanbul
fi



# - sudo apt-get update
# - sudo apt-get install -y libappindicator1 fonts-liberation
# - wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
# - sudo dpkg -i google-chrome*.deb
# - export CHROME_BIN=/usr/bin/google-chrome
# - export DISPLAY=:99.0
# - sh -e /etc/init.d/xvfb start
