#!/bin/bash

#ONLY FOR macOS
#DON'T EXECUTE THIS - BUT USE install-macos.sh, please

echo installing homebrew if necessary
which -s brew
if [[ $? != 0 ]] ; then
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
    brew update
    brew upgrade
fi

echo installing homebrew packages, only if not already available
which -s readline || brew install readline
which -s wget || brew install wget
which -s python3 || brew install python3

read -p "Would you install Node.js and npm? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing nodejs and npm, only if not already available
  which -s node || brew install node
fi

read -p "Would you install/compile MongoDb? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing mongodb
  brew install mongodb --with-openssl
  #create a folder for mongodb to prevent an error on mac osx
  sudo mkdir -p /data/db
fi
