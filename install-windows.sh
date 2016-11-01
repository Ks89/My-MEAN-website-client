
#!/bin/bash

#ONLY FOR Windows (tested on Windows 10)

echo Welcome to KS89 My MEAN Website 1.0.0-alpha3 install script for Windows
echo use this script with Windows PowerShell

echo Before to execute this:
echo 1. Install Nodejs
echo 2. Install redis-server (the only official Windows port is available here https://github.com/rgl/redis/downloads)
echo 3. Install MongoDB

echo After the installation:
echo 1. Install Mongochef to import db scripts into `docs` folder
echo 2. Install git (with Git bash gui)
echo 3. Create this folder structure: C:\data\db
echo 4. Start mongoDb with this command: C:\Program Files\MongoDB\Server\3.2\bin\mongod
echo 5. create a .env files into the main folder with the required entries

read -p "Do u want to install My MEAN Website? Are you ready? Type y or n " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing some global packages from npm
  bash setup/windows/npm.sh
fi
