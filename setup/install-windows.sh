
#!/bin/bash

#ONLY FOR Windows (tested on Windows 10)

echo Welcome to KS89 My MEAN Website 1.0.0-alpha install script for Windows
echo use this script with Windows PowerShell

echo Before to execute this, install Node.js

read -p "Do u want to install My MEAN Website? Are you ready? Type y or n " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing some global packages from npm
  bash windows/npm.sh
fi
