#!/usr/bin/env bash

# run debug build
echo "npm run debug build on $TRAVIS_OS_NAME"
#npm run build:dev

# run production build
echo "npm run production build on $TRAVIS_OS_NAME"
#npm run build:prod

# clean before the real production build
npm run clean

# run production + AOT build
echo "npm run production + AOT build on $TRAVIS_OS_NAME"
npm run build:prod:aot

# run unit test
echo "npm run test on $TRAVIS_OS_NAME"
#npm test

# run e2e test (requires server-side up and running)
echo "dropping db collections"
mongo KS --eval 'db.projects.drop()'

echo "filling db with data"
mongorestore -d KS -c projects --dir=./db-dump-e2e/KS/projects.bson

sleep 5

# start
export FRONT_END_PATH=../My-MEAN-website-client/dist
echo "FRONT_END_PATH is $FRONT_END_PATH"
export BYPASS_CI=yes
echo "BYPASS_CI is $BYPASS_CI"
export NODE_ENV=development
echo "NODE_ENV is $NODE_ENV"

cd ../My-MEAN-website-server
# npm --prefix ../My-MEAN-website-server/ run prod:start
# pm2 start bin/www -i 4 --env development  # I should change this with a custom value, for instance "e2e" or "ci"
npm start NODE_ENV=development npm start # CI==='yes' by default and you cannot change it
cd ../My-MEAN-website-client

sleep 5

echo "npm run e2e on $TRAVIS_OS_NAME"
npm run ci:e2e