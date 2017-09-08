#!/usr/bin/env bash

echo "Stopping server side"
cd ../My-MEAN-website-server
# npm --prefix ../My-MEAN-website-server/ run prod:stop
pm2 stop bin/www
cd ../My-MEAN-website-client

echo "Finished... bye bye :)"
