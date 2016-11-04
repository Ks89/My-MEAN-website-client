var Utils = require('../utils/util');

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
  req.session.authToken = JSON.stringify({
    _id: 'fakeid',
    user: null,
    token: null, // without token
    exp: (new Date()).getTime()
  });
  console.log('setJsonWithoutTokenSession forced -> req.session.authToken = a JSON');
  Utils.sendJSONres(res, 200, {message: "Session modified correctly!"});
};

var setJsonWithWrongFormatTokenSession = function(req, res) {
  req.session.authToken = JSON.stringify({
    _id: 'fakeid',
    token: 'wrong.format', // only one dot :)
    user: null,
    exp: (new Date()).getTime()
  });
  console.log('setJsonWithWrongFormatTokenSession forced -> req.session.authToken = a JSON');
  Utils.sendJSONres(res, 200, {message: "Session modified correctly!"});
};

var setJsonWithExpiredDateSession = function(req, res) {
  req.session.authToken = JSON.stringify({
    _id: 'fakeid',
    token: 'wrong.format', // only one dot :)
    user: null,
    exp: (new Date()).getTime()-50000 // obviously wrong
  });
  console.log('setJsonWithExpiredDateSession forced -> req.session.authToken = a JSON');
  Utils.sendJSONres(res, 200, {message: "Session modified correctly!"});
};

module.exports = {
  destroySession: destroySession,
  setStringSession: setStringSession,
  setJsonWithoutTokenSession: setJsonWithoutTokenSession,
  setJsonWithWrongFormatTokenSession: setJsonWithWrongFormatTokenSession,
  setJsonWithExpiredDateSession: setJsonWithExpiredDateSession
};
