var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');
var jwt = require('jsonwebtoken');
var Utils = require('../utils/util.js');
var utils = new Utils();


/* GET to decode a JWT passing the token itself*/
/* /api/decodeToken/:token */
var decodeToken = function(req, res) {
  console.log('decodetoken', req.params);
  if (req.params && req.params.token) {

    const token = req.params.token;
    console.log("data received jwt: " + token);

    // verify a token symmetric
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if(err) {
        console.log("jwt.verify error");
        utils.sendJSONresponse(res, 404, null);
      } 

      if(decoded) {
        console.log("decoded valid");
        if(utils.isJwtValidDate(decoded)) {
          console.log("systemDate valid");
          console.log("stringifying...");
          console.log(JSON.stringify(decoded));
          utils.sendJSONresponse(res, 200, JSON.stringify(decoded));
        } else {
          console.log('No data valid');
          utils.sendJSONresponse(res, 404, "invalid-data");
        }
      }
    });
  } else {
    console.log('No token found');
    utils.sendJSONresponse(res, 404, null);
  }
};


/* GET to logout removing session data stored in Redis */
/* /api/logout */
var logout = function(req, res) {
  console.log('logout called (authToken): ' + req.session.authToken);
  if(req.session.authToken) {
    req.session.destroy(function(){
      console.log('Session data destroyed');
      utils.sendJSONresponse(res, 200, {});
    });
  } else {
    console.log('Authtoken not available as session data in Redis, for instance you aren\'t logged');
    utils.sendJSONresponse(res, 404, null);
  }
};

/* GET to obtain the sessionToken stored in Redis */
/* /api/sessionToken */
var sessionToken = function(req, res) {
  console.log('sessionToken called');
  console.log('data available (authToken): ' + req.session.authToken);
  if(req.session.authToken) {
    utils.sendJSONresponse(res, 200, req.session.authToken);
  } else {
    console.log('Authtoken not available as session data in Redis, for instance you aren\'t logged');
    utils.sendJSONresponse(res, 404, null);
  }
};

var checkIfLastUnlink = function(serviceName, user) {
  switch(serviceName) {
    case 'github':
      return !user.facebook.id && !user.google.id && !user.local.email;
    case 'google':
      return !user.github.id && !user.facebook.id && !user.local.email;
    case 'facebook':
      return !user.github.id && !user.google.id && !user.local.email;
    case 'local':
      return !user.github.id && !user.google.id && !user.facebook.id;
    default:
      console.log('Service name not recognized in checkIfLastUnlink');
      return false;
  }
};

var removeServiceFromDb = function(serviceName, user) {
  if(serviceName) {
    user[serviceName] = undefined;
  } else {
    console.log('Service name not recognized to unlink');
  }
  return user;
};

var generateJwtCookie = function(user) {
  const token3dauth = user.generateJwt(user);
  const authToken = JSON.stringify({ 
    'value': user._id,
    'token': token3dauth
  });
  return authToken;
};


var unlinkServiceByName = function(req, serviceName, res) {
  console.log("UnlinkServiceByName authToken: " + req.session.authToken);
  if(!req.session.authToken) {
    console.error("req.session.authToken not available");
    utils.sendJSONresponse(res, 404, null);
  }

  var token = JSON.parse(req.session.authToken).token;
  console.log("Token is: " + token);  

  if(!token) {
    console.error("Token not found");
    utils.sendJSONresponse(res, 404, null);
  }

  // verify a token symmetric
  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if(err) {
      console.error("Unknown error during jwt.verify");
      utils.sendJSONresponse(res, 404, null);
    } 
    console.log('Trying to decode jwt');
    if(!decoded) {
      console.error("Impossible to decode: " + decoded);
      utils.sendJSONresponse(res, 404, null);
    }
    console.log("decoded valid");
    if(!utils.isJwtValidDate(decoded)) {
      console.error('No data valid');
      utils.sendJSONresponse(res, 404, null);
    }
    console.log("SystemDate valid");

    var user = decoded.user;
    console.log("User is: ");
    console.log(user);

    User.findById(user._id, function(err, user) {
      if (err) { 
        console.error('Error user not found (usersReadOneById)' + err);
        utils.sendJSONresponse(res, 404, null);
      }
      if(!user) {
        console.error("User not found - cannot unlink (usersReadOneById)");
        utils.sendJSONresponse(res, 404, null);
      }
      // if the user is found, then log them in
      console.log("User found (usersReadOneById): " + user);
      var lastUnlink = checkIfLastUnlink(serviceName, user);
      console.log('Check if last unlink: ' + lastUnlink);
      if(lastUnlink) {
        console.log("Last unlink - removing from db....");
        user.remove(function() {
          console.log("User removed from DB");
        });
        if(token) {
          req.session.destroy(function(){
            console.log('Last unlink, session data destroyed');
          });
        }
        utils.sendJSONresponse(res, 200, {});
      } else {
        console.log("Unlinking normal situation, without a remove....");
        user = removeServiceFromDb(serviceName, user);
        user.save(function(err) {
          if(err) {
            console.error("Impossible to remove userService from db");
            utils.sendJSONresponse(res, 404, null);
          }
          
          req.session.authToken = generateJwtCookie(user);
          console.log("Unlinking, regenerate session token after unlink");
          utils.sendJSONresponse(res, 200, user);
        });
      }
    });
  });
};

module.exports = {
  decodeToken: decodeToken,
  logout: logout,
  sessionToken: sessionToken,
  checkIfLastUnlink: checkIfLastUnlink,
  removeServiceFromDb: removeServiceFromDb,
  generateJwtCookie: generateJwtCookie,
  unlinkServiceByName: unlinkServiceByName,
};