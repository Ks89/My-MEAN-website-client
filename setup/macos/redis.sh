#!/bin/bash

#ONLY FOR macOS
#DON'T EXECUTE THIS - BUT USE install-macos.sh, please

read -p "Would you install redis-server? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing redis server
  wget http://download.redis.io/redis-stable.tar.gz
  tar xvzf redis-stable.tar.gz
  cd redis-stable
  make install
  cd ..
  rm -rf redis-stable
  rm -f redis-stable.tar.gz
fi
