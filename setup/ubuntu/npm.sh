#!/bin/bash

#ONLY FOR Ubuntu
#DON'T EXECUTE THIS - BUT USE install.sh

read -p "Would you install npm global packages? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing npm global packages
  sudo npm install -g karma-cli
  sudo npm install -g mocha
  sudo npm install -g webpack
  sudo npm install -g typescript
  sudo npm install -g nodemon
  sudo npm install -g gulp@github:gulpjs/gulp#4.0
  sudo npm install -g npm-check
  sudo npm install -g lite-server
  sudo npm install -g remap-istanbul
  sudo npm install -g webdriver-manager
  sudo npm install -g protractor
  sudo npm install -g nsp
  sudo npm install -g codeclimate-test-reporter
  sudo npm install -g istanbul
fi

read -p "Would you update webdriver-manager to be able to use Selenium Server? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo setting up a Selenium Server
  sudo webdriver-manager update
fi
