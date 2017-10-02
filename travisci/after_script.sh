#!/usr/bin/env bash

echo "Stopping server side"
ls
cd ../My-MEAN-website-server
ls
npm run e2e:stop
cd ../My-MEAN-website-client
ls
echo "Finished... bye bye :)"
