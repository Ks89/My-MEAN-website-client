#!/bin/bash

mongo KS --eval 'db.users.drop()'

mongorestore -d KS -c users --dir=./db-dump-e2e/KS/users.bson --maintainInsertionOrder

# set activation expire date to 10 days in the future from now
mongo KS --eval 'db.users.update({ "local.email":"activate@fake-mmw.com"}, { $set: { "local.activateAccountExpires": new Date((new Date()).getTime() + 10 * 24 * 60 * 60 * 1000)} })'