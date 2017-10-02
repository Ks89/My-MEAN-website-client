#!/usr/bin/env bash

# run debug build
echo "npm run debug build on $TRAVIS_OS_NAME"
npm run build:dev

# run production build
echo "npm run production build on $TRAVIS_OS_NAME"
npm run build:prod

# clean before the real production build
npm run clean

# run production + AOT build
echo "npm run production + AOT build on $TRAVIS_OS_NAME"
npm run build:prod:aot

# run unit test
echo "npm run test on $TRAVIS_OS_NAME"
npm test

# run e2e test (requires a db with some data and the server-side up and running)
echo "dropping db collections for test-db"
mongo test-db --eval "db.getCollectionNames()"
mongo test-db --eval 'db.projects.drop()'
mongo test-db --eval 'db.users.drop()'

echo "filling test-db with data"
mongorestore -d test-db -c projects --dir=./db-dump-e2e/KS/projects.bson --maintainInsertionOrder
mongorestore -d test-db -c users --dir=./db-dump-e2e/KS/users.bson --maintainInsertionOrder

echo "updating activation expire date"
mongo test-db --eval 'db.users.update({ "local.email":"activate@fake-mmw.com"}, { $set: { "local.activateAccountExpires": new Date((new Date()).getTime() + 10 * 24 * 60 * 60 * 1000)} })'

echo "updating reset expire date"
mongo test-db --eval 'db.users.update({ "local.email":"reset@fake-mmw.com"}, { $set: { "local.resetPasswordExpires": new Date((new Date()).getTime() + 10 * 24 * 60 * 60 * 1000)} })'

sleep 5

# start
export FRONT_END_PATH=../My-MEAN-website-client/dist
echo "FRONT_END_PATH is $FRONT_END_PATH"

cd ../My-MEAN-website-server
ls
npm run e2e:start
cd ../My-MEAN-website-client
ls

# update webdriver to be able to run e2e tests
npm run webdriver:update:ci

sleep 5

echo "npm run e2e on $TRAVIS_OS_NAME"
npm run e2e:ci