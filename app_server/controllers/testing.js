var Utils = require('../utils/util');
var jwt = require('jsonwebtoken');

var destroySession = function(req, res) {
  req.session.destroy(() => {
    console.log('destroySession forced -> session.destroy');
    Utils.sendJSONres(res, 200, {message: "Session destroyed correctly!"});
  });
};

var setStringSession = function(req, res) {
  req.session.authToken = 'fake';
  console.log('setStringSession forced -> req.session.authToken = fake');
  Utils.sendJSONres(res, 200, {message: "Session modified correctly!"});
};

var setJsonWithoutTokenSession = function(req, res) {
  req.session.authToken = JSON.stringify({ token: null });
  console.log('setJsonWithoutTokenSession forced -> req.session.authToken = a JSON');
  Utils.sendJSONres(res, 200, {message: "Session modified correctly!"});
};

var setJsonWithWrongFormatTokenSession = function(req, res) {
  const wrongFormatToken = 'wrong.format'; // only one dot :)
  req.session.authToken = JSON.stringify({ token: wrongFormatToken });
  console.log('setJsonWithWrongFormatTokenSession forced -> req.session.authToken = a JSON');
  Utils.sendJSONres(res, 200, {message: "Session modified correctly!"});
};

var setJsonWithExpiredDateSession = function(req, res) {
  let expired = new Date();
  expired.setTime(expired.getTime() - 600000); //expired 10 minutes ago (10*60*1000)
  req.session.authToken = getAuthSessionTokenFake('fake_id', null, expired.getTime());
  console.warn(req.session.authToken);
  console.log('setJsonWithExpiredDateSession forced -> req.session.authToken = a JSON');
  Utils.sendJSONres(res, 200, {message: "Session modified correctly!"});
};

// private function used to generate fake (but valid)
// jwt tokens for testing purposes
function getAuthSessionTokenFake(_id, user, floatDate) {
  let fakeJwtSigned = jwt.sign({
    _id: _id,
    user: user,
    exp: parseFloat(floatDate),
  }, process.env.JWT_SECRET);
  return JSON.stringify({ token: fakeJwtSigned });
}

module.exports = {
  destroySession: destroySession,
  setStringSession: setStringSession,
  setJsonWithoutTokenSession: setJsonWithoutTokenSession,
  setJsonWithWrongFormatTokenSession: setJsonWithWrongFormatTokenSession,
  setJsonWithExpiredDateSession: setJsonWithExpiredDateSession
};
