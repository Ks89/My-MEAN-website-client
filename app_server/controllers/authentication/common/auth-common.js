var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../../../utils/logger');
var jwt = require('jsonwebtoken');
var Utils = require('../../../utils/util');
var AuthUtils = require('../../../utils/auth-util');
var async = require('async');
var _ = require('lodash');
var whitelistServices = require('../serviceNames');

/* GET to decode a JWT passing the token itself*/
/* /api/decodeToken/:token */
var decodeToken = function(req, res) {
  console.log(req.params);

  if (req.params && req.params.token) {
    const token = req.params.token;

    Utils.isJwtValid(token)
    .then(result => {
      console.log("IsJwtValid result: " + JSON.stringify(result));
      Utils.sendJSONres(res, 200, JSON.stringify(result));
    }, reason => {
      console.log("IsJwtValid error: " + reason);
      Utils.sendJSONres(res, reason.status, reason.message);
    });
  } else {
    console.log('No token found');
    Utils.sendJSONres(res, 404, "No token found");
  }
};


/* GET to logout removing session data stored in Redis */
/* /api/logout */
var logout = function(req, res) {
  console.log('logout called (authToken): ' + req.session.authToken);
  if(req.session.authToken) {
    req.session.destroy(() => {
      console.log('Session data destroyed');
      Utils.sendJSONres(res, 200, {message: "Logout succeeded"});
    });
  } else {
    console.log('Authtoken not available as session data in Redis, for instance you aren\'t logged');
    Utils.sendJSONres(res, 404, "Authtoken not available as session data");
  }
};

/* GET to obtain the sessionToken stored in Redis */
/* /api/sessionToken */
var sessionToken = function(req, res) {
  console.log('sessionToken called');
  console.log('data available (authToken): ' + req.session.authToken);
  if(req.session.authToken) {
    Utils.sendJSONres(res, 200, req.session.authToken);
  } else {
    console.log('Authtoken not available as session data in Redis, for instance you aren\'t logged');
    Utils.sendJSONres(res, 404, "Authtoken not available as session data");
  }
};

var generateSessionJwtToken = function(user) {
  if(!user || _.isString(user) || !_.isObject(user) || _.isArray(user) ||
      _.isBoolean(user) || _.isDate(user) || Utils.isNotAcceptableValue(user)) {
    throw 'User must be a valid object';
  }

  //call a user's model method to generete a jwt signed token
  const token3dauth = user.generateSessionJwtToken();
  const authToken = JSON.stringify({
    token: token3dauth
  });
  return authToken;
};

var unlinkServiceByName = function(req, serviceName, res) {
  console.log("UnlinkServiceByName authToken: " + req.session.authToken);
  if(!req.session.authToken) {
    //in theory, !req.session.authToken will be catched inside rest-auth-middleware
    //I added some checks only to prevent strange behaviours.
    console.error("req.session.authToken not available");
    Utils.sendJSONres(res, 401, "Session not valid, probably it's expired");
    return;
  }

  var token = JSON.parse(req.session.authToken).token;
  console.log("Token is: " + token);

  if(!token) {
    //as the previous one
    console.error("Token not found");
    Utils.sendJSONres(res, 401, "Token not found");
    return;
  }

  async.waterfall([
    done => {
      Utils.isJwtValid(token)
      .then(result => {
        console.log("IsJwtValid result: " + result);
        done(null, result);
      }, reason => {
        console.log("IsJwtValid error: " + reason);
        Utils.sendJSONres(res, reason.status, reason.message);
      });
    },
    (decodedToken, done) => {
      User.findById(decodedToken.user._id, (err, user) => {
        if (err || !user) {
          console.log("User not found - cannot unlink (usersReadOneById)");
          Utils.sendJSONres(res, 404, "User not found - cannot unlink");
          return;
        }
        console.log("User found (usersReadOneById): " + user);
        done(err, user, decodedToken);
      });
    },
    (user, decodedToken, done) => {
      var lastUnlink = AuthUtils.checkIfLastUnlink(serviceName, user);
      console.log('Check if last unlink: ' + lastUnlink);
      if(lastUnlink) {
        if(decodedToken) {
          req.session.destroy(() => {
            console.log('Last unlink, session data destroyed');
            console.log("Last unlink - removing from db....");
            user.remove(() => {
              console.log("User removed from DB");
              done(null, user);
            });
          });
        }
      } else {
        console.log("Unlinking normal situation, without a remove....");
        user = AuthUtils.removeServiceFromUserDb(serviceName, user);
        user.save(err => {
          if(err) {
            console.error("Impossible to remove userService from db");
            Utils.sendJSONres(res, 500, "Impossible to remove userService from db");
            return;
          }

          req.session.authToken = generateSessionJwtToken(user);
          console.log("Unlinking, regenerate session token after unlink");
          done(err, user);
        });
      }
    }], (err, user) => {
      if (err) {
        console.log(err);
        Utils.sendJSONres(res, 500, "Unknown error");
      } else {
        Utils.sendJSONres(res, 200, "User unlinked correctly!");
      }
    });
};

module.exports = {
  decodeToken: decodeToken,
  logout: logout,
  sessionToken: sessionToken,
  generateSessionJwtToken: generateSessionJwtToken,
  unlinkServiceByName: unlinkServiceByName
};
