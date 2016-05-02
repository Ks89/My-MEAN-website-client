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

var generateJwtCookie = function(user) {
  var token3dauth = user.generateJwt(user);
  var authToken = JSON.stringify({ 
    'value': user._id,
    'token': token3dauth
  });
  return authToken;
};


var unlinkFromDb = function(req, serviceName, res) {
  console.log("€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€");
  console.log(req.session.authToken);
  console.log("€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€");

  if(req.session.authToken) {
    console.log("X€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€");

    var tok = JSON.parse(req.session.authToken).token;
    console.log(tok);
    

    if (tok) {

        var token = tok;
        console.log("data received jwt: " + token);

        // verify a token symmetric
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
          if(err) {
            console.log("ERROR");
            utils.sendJSONresponse(res, 404, null);
          } 
          console.log('trying to decode');
          if(decoded) {
            console.log("decoding...");
            console.log(decoded);
            var convertedDate = new Date();
            convertedDate.setTime(decoded.exp);
            
            console.log("date jwt: " + convertedDate.getTime() +
              ", formatted: " + utils.getTextFormattedDate(convertedDate));
            
            var systemDate = new Date();
            console.log("systemDate: " + systemDate.getTime() + 
              ", formatted: " + utils.getTextFormattedDate(systemDate));

            if( convertedDate.getTime() > systemDate.getTime() ) {
              console.log("systemDate valid");

                var user = decoded.user;
          console.log('check if user exist, serviceName=' + serviceName);
          console.log("user is: ");
          console.log(user);


          User.findById(user._id, function(err, user) {
            console.log("User.findOne...");
            if (err) { 
              console.log('Error user not found (usersReadOneById)' + err);
              utils.sendJSONresponse(res, 404, null);
            }
                if (user) { // if the user is found, then log them in
                  console.log("User found (usersReadOneById): " + user);
                  
                  var lastUnlink = checkIfLastUnlink(serviceName, user);
              console.log('check if last unlink: ' + lastUnlink);
              if(lastUnlink) {
                console.log("last unlink found - removing....");
                user.remove(function() {
                  console.log("removed user");
                });
                if(req.session.authToken) {
                  req.session.destroy(function(){
                    console.log('Last unlink, session data destroyed');
                  });
                }
                utils.sendJSONresponse(res, 200, {});
              } else {
                console.log("unlinking normal situation, without a remove....");
                
                user = removeServiceFromDb(serviceName, user);
                user.save(function(err) {
                  if(!err) {
                    req.session.authToken = generateJwtCookie(user);
                    console.log("Unlinking, regenerate session token after unlink");
                    utils.sendJSONresponse(res, 200, user);
                  } else {
                    console.log("Impossible to remove userService from db");
                    utils.sendJSONresponse(res, 404, null);
                  }
                });
              }

                } else { //otherwise, if there is no user found create them
                  console.log("User not found - cannot unlink (usersReadOneById)");
                    utils.sendJSONresponse(res, 404, null);
                }
          });

            } else {
              console.log('No data valid');
              utils.sendJSONresponse(res, 404, null);
            }
          } else {
            console.log("Impossible to decode: " + decoded);
            utils.sendJSONresponse(res, 404, null);
          }
        });

      } else {
        utils.sendJSONresponse(res, 404, null);
      }
  } else {
    utils.sendJSONresponse(res, 404, null);
  }
};

/* GET to unlink the local account*/
/* /api/unlink/local */
var unlinkLocal = function(req, res, serviceName) {
  if(req.session.authToken) {
    console.log("X€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€");
    var tok = JSON.parse(req.session.authToken).token;
    console.log(tok); 
    if (tok) {
        var token = tok;
        console.log("data received jwt: " + token);

        // verify a token symmetric
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
          if(err) {
            console.log("ERROR");
            utils.sendJSONresponse(res, 404, null);
          } 
          console.log('trying to decode');
          if(decoded) {
            console.log("decoding...");
            console.log(decoded);
            var convertedDate = new Date();
            convertedDate.setTime(decoded.exp);
            
            console.log("date jwt: " + convertedDate.getTime() +
              ", formatted: " + utils.getTextFormattedDate(convertedDate));
            
            var systemDate = new Date();
            console.log("systemDate: " + systemDate.getTime() + 
              ", formatted: " + utils.getTextFormattedDate(systemDate));

            if( convertedDate.getTime() > systemDate.getTime() ) {
              console.log("systemDate valid");

                var user = decoded.user;
                console.log('check if user exist, serviceName=local');
                console.log("user is: ");
                console.log(user);


                User.findById(user._id, function(err, user) {
                  console.log("User.findOne...");
                  if (err) { 
                    console.log('Error user not found (usersReadOneById)' + err);
                    utils.sendJSONresponse(res, 404, null);
                  }
                      if (user) { // if the user is found, then log them in
                        console.log("User found (usersReadOneById): " + user);
                        
                        var lastUnlink = checkIfLastUnlink('local', user);
                    console.log('check if last unlink: ' + lastUnlink);
                    if(lastUnlink) {
                      console.log("last unlink found - removing....");
                      user.remove(function() {
                        console.log("removed user");
                      });
                      if(req.session.authToken) {
                        req.session.destroy(function(){
                          console.log('Last unlink, session data destroyed');
                        });
                      }
                      utils.sendJSONresponse(res, 200, {});
                    } else {
                      console.log("unlinking normal situation, without a remove....");
                      
                      user = removeServiceFromDb('local', user);
                      user.save(function(err) {
                        if(!err) {
                          req.session.authToken = generateJwtCookie(user);
                          console.log("Unlinking, regenerate session token after unlink");
                          utils.sendJSONresponse(res, 200, user);
                        } else {
                          console.log("Impossible to remove userService from db");
                          utils.sendJSONresponse(res, 404, null);
                        }
                      });
                    }
                      } else { //otherwise, if there is no user found create them
                        console.log("User not found - cannot unlink (usersReadOneById)");
                          utils.sendJSONresponse(res, 404, null);
                      }
                });

            } else {
              console.log('No data valid');
              utils.sendJSONresponse(res, 404, null);
            }
          } else {
            console.log("Impossible to decode: " + decoded);
            utils.sendJSONresponse(res, 404, null);
          }
        });
      } else {
        utils.sendJSONresponse(res, 404, null);
      }
  } else {
    utils.sendJSONresponse(res, 404, null);
  }
};

module.exports = {
  decodeToken: decodeToken,
  logout: logout,
  sessionToken: sessionToken,
  checkIfLastUnlink: checkIfLastUnlink,
  removeServiceFromDb: removeServiceFromDb,
  generateJwtCookie: generateJwtCookie,
  unlinkFromDb: unlinkFromDb,
  unlinkLocal: unlinkLocal,
};