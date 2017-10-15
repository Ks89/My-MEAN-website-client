echo "mongodb install script is running"
echo "adding a new apt-key"
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
#echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
echo "deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
echo "updating apt"
sudo apt-get update
echo "installing mongodb"
sudo apt-get install -y mongodb-org
#sudo apt-get install -y mongodb-org-shell
echo "mongodb install script completed"
