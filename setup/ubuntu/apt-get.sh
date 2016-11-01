#!/bin/bash

#ONLY FOR Ubuntu
#DON'T EXECUTE THIS - BUT USE install.sh, please

echo installing packages, only if not already available
sudo apt-get install git
sudo apt-get install tig

read -p "Would you install Node.js and npm? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing nodejs and npm
  curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
  sudo apt-get install -y nodejs
  sudo apt-get install -y build-essential
fi

read -p "Would you install/compile MongoDb? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing mongodb
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
  echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/testing multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org
  sudo cp setup/ubuntu/mongod.service /lib/systemd/system/mongod.service
fi
