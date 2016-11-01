#!/bin/bash

#ONLY FOR Ubuntu
#DON'T EXECUTE THIS - BUT USE install.sh, please

# Taken from https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04

read -p "Would you install redis-server? Press y or n: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo installing redis server
  sudo apt-get update
  sudo apt-get install build-essential tcl
  cd /tmp
  curl -O http://download.redis.io/redis-stable.tar.gz
  tar xzvf redis-stable.tar.gz
  cd redis-stable
  make
  make test
  sudo make install
  sudo mkdir /etc/redis
  sudo cp /tmp/redis-stable/redis.conf /etc/redis
  sudo cp redis.conf /etc/redis/redis.conf

  # sudo nano /etc/systemd/system/redis.service

  sudo cp redis.service /etc/systemd/system/redis.service

  sudo adduser --system --group --no-create-home redis
  sudo mkdir /var/lib/redis
  sudo chown redis:redis /var/lib/redis
  sudo chmod 770 /var/lib/redis
  sudo systemctl start redis
  sudo systemctl status redis
  # press q
  # redis-cli
  sudo systemctl restart redis
  # redis-cli
  sudo systemctl enable redis
fi
