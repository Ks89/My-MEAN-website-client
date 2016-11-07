#gulp test # gulp test blocks on finish
mocha test-server-integration/
mocha test-server-unit/3dparty-passport.spec.js
mocha test-server-unit/auth-experimental-collapse-db.spec.js
mocha test-server-unit/auth-util.spec.js
mocha test-server-unit/passport.spec.js
mocha test-server-unit/users.spec.js
mocha test-server-unit/util.spec.js

cd app_client
npm test
cd ..
