var logger = require('../utils/logger.js');

var jwt = require('jsonwebtoken');

var Utils = require('../utils/util.js');
var utils = new Utils();

/* GET to decode a JWT passing the token itself*/
/* /api/decodeToken/:token */
module.exports.decodeToken = function(req, res) {
  console.log('decodetoken', req.params);
  if (req.params && req.params.token) {

    var token = req.params.token;
    console.log("data received jwt: " + token);

    // verify a token symmetric
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if(err) {
        console.log("jwt.verify error");
        utils.sendJSONresponse(res, 404, null);
      } 

      if(decoded) {
        console.log("decoding...");
        var convertedDate = new Date();
        convertedDate.setTime(decoded.exp);
        
        console.log("date jwt: " + convertedDate.getTime() +
          ", formatted: " + utils.getTextFormattedDate(convertedDate));
        
        var systemDate = new Date();
        console.log("systemDate: " + systemDate.getTime() + 
          ", formatted: " + utils.getTextFormattedDate(systemDate));

        if( convertedDate.getTime() > systemDate.getTime() ) {
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
module.exports.logout = function(req, res) {
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
module.exports.sessionToken = function(req, res) {
  console.log('sessionToken called');
  console.log('data available (authToken): ' + req.session.authToken);
  if(req.session.authToken) {
    utils.sendJSONresponse(res, 200, req.session.authToken);
  } else {
    console.log('Authtoken not available as session data in Redis, for instance you aren\'t logged');
    utils.sendJSONresponse(res, 404, null);
  }
};

module.exports.checkIfLastUnlink = function(serviceName, user) {
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

module.exports.removeServiceFromDb = function(serviceName, user) {
  switch(serviceName) {
      case 'facebook': 
        user.facebook = undefined;
        break;
      case 'github': 
        user.github = undefined;
        break;
      case 'google': 
        user.google = undefined;
        break;
      case 'twitter': 
        user.twitter = undefined;
        break;
      case 'linkedin': 
        user.linkedin = undefined;
        break;
      case 'local':
        user.local = undefined;
        break;
      default:
        console.log('Service name not recognized to unlink');
        break;
    }
    return user;
};

module.exports.generateJwtCookie = function(user) {
  var token3dauth = user.generateJwt(user);
  var authToken = JSON.stringify({ 
    'value': user._id,
    'token': token3dauth
  });
  return authToken;
};