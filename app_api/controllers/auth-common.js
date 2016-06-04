var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');
var jwt = require('jsonwebtoken');
var Utils = require('../utils/util.js');
var async = require('async');

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
        Utils.sendJSONresponse(res, 404, null);
      } 

      if(decoded) {
        console.log("decoded valid");
        if(Utils.isJwtValidDate(decoded)) {
          console.log("systemDate valid");
          console.log("stringifying...");
          console.log(JSON.stringify(decoded));
          Utils.sendJSONresponse(res, 200, JSON.stringify(decoded));
        } else {
          console.log('No data valid');
          Utils.sendJSONresponse(res, 404, "invalid-data");
        }
      }
    });
  } else {
    console.log('No token found');
    Utils.sendJSONresponse(res, 404, null);
  }
};


/* GET to logout removing session data stored in Redis */
/* /api/logout */
var logout = function(req, res) {
  console.log('logout called (authToken): ' + req.session.authToken);
  if(req.session.authToken) {
    req.session.destroy(function(){
      console.log('Session data destroyed');
      Utils.sendJSONresponse(res, 200, {});
    });
  } else {
    console.log('Authtoken not available as session data in Redis, for instance you aren\'t logged');
    Utils.sendJSONresponse(res, 404, null);
  }
};

/* GET to obtain the sessionToken stored in Redis */
/* /api/sessionToken */
var sessionToken = function(req, res) {
  console.log('sessionToken called');
  console.log('data available (authToken): ' + req.session.authToken);
  if(req.session.authToken) {
    Utils.sendJSONresponse(res, 200, req.session.authToken);
  } else {
    console.log('Authtoken not available as session data in Redis, for instance you aren\'t logged');
    Utils.sendJSONresponse(res, 404, null);
  }
};

var checkIfLastUnlink = function(serviceName, user) {
  switch(serviceName) {
    case 'github':
      return !user.facebook.id && !user.google.id && !user.local.email && !user.twitter.id && !user.linkedin.id;
    case 'google':
      return !user.github.id && !user.facebook.id && !user.local.email && !user.twitter.id && !user.linkedin.id;
    case 'facebook':
      return !user.github.id && !user.google.id && !user.local.email && !user.twitter.id && !user.linkedin.id;
    case 'local':
      return !user.github.id && !user.google.id && !user.facebook.id && !user.twitter.id && !user.linkedin.id;
    case 'twitter':
      return !user.github.id && !user.google.id && !user.facebook.id && !user.local.email && !user.linkedin.id;
    case 'linkedin':
      return !user.github.id && !user.google.id && !user.facebook.id && !user.local.email && !user.twitter.id;
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
  const token3dauth = user.generateJwt();
  const authToken = JSON.stringify({ 
    'token': token3dauth
  });
  return authToken;
};


var unlinkServiceByName = function(req, serviceName, res) {
  console.log("UnlinkServiceByName authToken: " + req.session.authToken);
  if(!req.session.authToken) {
    console.error("req.session.authToken not available");
    Utils.sendJSONresponse(res, 404, null);
  }

  var token = JSON.parse(req.session.authToken).token;
  console.log("Token is: " + token);  

  if(!token) {
    console.error("Token not found");
    Utils.sendJSONresponse(res, 404, null);
  }

  async.waterfall([
    done => {
      jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) throw err;
        
        console.log('Trying to decode jwt');
        if(!decoded) {
          console.error("Impossible to decode: " + decoded);
          throw err;
        }
        console.log("decoded valid");
        if(!Utils.isJwtValidDate(decoded)) {
          console.error('No data valid');
          throw err;
        }
        console.log("SystemDate valid");

        var user = decoded.user;
        console.log("User is: ");
        console.log(user);
        done(err, decoded, user);
      });
    }, 
    (token, user, done) => {
      User.findById(user._id, function(err, user) {
        if (err) { 
          console.error('Error user not found (usersReadOneById)' + err);
          throw err;
          //Utils.sendJSONresponse(res, 404, null);
        }
        if(!user) {
          console.error("User not found - cannot unlink (usersReadOneById)");
          throw err;
          //Utils.sendJSONresponse(res, 404, null);
        }
        // if the user is found, then log them in
        console.log("User found (usersReadOneById): " + user);
        done(err, user, token);
      });
    },
    (user, token, done) => {
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
        done(null, user);
        //Utils.sendJSONresponse(res, 200, {});
      } else {
        console.log("Unlinking normal situation, without a remove....");
        user = removeServiceFromDb(serviceName, user);
        user.save(function(err) {
          if(err) {
            console.error("Impossible to remove userService from db");
            throw err;
            //Utils.sendJSONresponse(res, 404, null);
          }
          
          req.session.authToken = generateJwtCookie(user);
          console.log("Unlinking, regenerate session token after unlink");
          //Utils.sendJSONresponse(res, 200, user);
          done(err, user);
        });
      }
    }], (err, user) => {
      console.log(err);
      if (err) { 
        console.log(err);
        Utils.sendJSONresponse(res, 404, null);
        //return next(err);
      } else {
        Utils.sendJSONresponse(res, 200, "User unlinked correctly!");      
      }
    });
};

// var isLoggedIn = function(req, res) {
//   console.log('isLoggedIn called');
//   console.log('isLoggedIn data available (authToken): ' + req.session.authToken);
//   if(req.session.authToken) {


//     // verify a token symmetric
//     jwt.verify(req.session.authToken, process.env.JWT_SECRET, function(err, decoded) {
//       if(err) {
//         console.log("jwt.verify error");
//         Utils.sendJSONresponse(res, 404, null);
//       } 

//       if(decoded) {
//         console.log("decoded valid");
//         if(Utils.isJwtValidDate(decoded)) {
//           console.log("systemDate valid");
//           console.log("stringifying...");
//           console.log(JSON.stringify(decoded));
//           var islogged = {
//             thirdpartyauth: false,
//             local: false
//           };
//           if(decoded.user) {
//             if(decoded.user.local) {
//               islogged.local = true;
//             }
//             if(decoded.user.github || decoded.user.facebook ||  decoded.user.google) {
//               islogged.thirdpartyauth = true;
//             }
//           }
//           Utils.sendJSONresponse(res, 200, JSON.stringify(islogged));
//         } else {
//           console.log('No data valid');
//           Utils.sendJSONresponse(res, 404, "invalid-data");
//         }
//       }
//     });


//     Utils.sendJSONresponse(res, 200, req.session.authToken);
//   } else {
//     console.log('isLoggedIn: Authtoken not available as session data in Redis, for instance you aren\'t logged');
//     Utils.sendJSONresponse(res, 404, null);
//   }
//   Utils.sendJSONresponse(res, 404, null);
// };

module.exports = {
  decodeToken: decodeToken,
  logout: logout,
  sessionToken: sessionToken,
  checkIfLastUnlink: checkIfLastUnlink,
  removeServiceFromDb: removeServiceFromDb,
  generateJwtCookie: generateJwtCookie,
  unlinkServiceByName: unlinkServiceByName,
};