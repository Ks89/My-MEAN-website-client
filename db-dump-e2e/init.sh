#!/bin/bash

mongo test-db --eval 'db.projects.drop()'
mongo test-db --eval 'db.users.drop()'

mongorestore -d test-db -c projects --dir=./db-dump-e2e/KS/projects.bson --maintainInsertionOrder
mongorestore -d test-db -c users --dir=./db-dump-e2e/KS/users.bson --maintainInsertionOrder

# set activation expire date to 10 days in the future from now
mongo test-db --eval 'db.users.update({ "local.email":"activate@fake-mmw.com"}, { $set: { "local.activateAccountExpires": new Date((new Date()).getTime() + 10 * 24 * 60 * 60 * 1000)} })'

# set reset expire date to 10 days in the future from now
mongo test-db --eval 'db.users.update({ "local.email":"reset@fake-mmw.com"}, { $set: { "local.resetPasswordExpires": new Date((new Date()).getTime() + 10 * 24 * 60 * 60 * 1000)} })'