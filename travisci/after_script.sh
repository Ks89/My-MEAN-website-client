#!/usr/bin/env bash

echo "Stopping server side"
cd ../My-MEAN-website-server
npm run ci:pm2:stop
cd ../My-MEAN-website-client

echo "Finished... bye bye :)"
