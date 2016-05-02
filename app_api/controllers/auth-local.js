var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');

var authCommon = require('./auth-common.js');
var jwt = require('jsonwebtoken');

var Utils = require('../utils/util.js');
var utils = new Utils();

/* POST to register a local user */
/* /api/register */
module.exports.register = function(req, res) {
  console.log('called register server side');
  if(!req.body.name || !req.body.email || !req.body.password) {
    utils.sendJSONresponse(res, 400, "All fields required");
  }

  User.findOne({ 'local.email': req.body.email }, function (err, user) {
    if (err || user) { 
      utils.sendJSONresponse(res, 400, "User already exists. Try to login.");
    }

    var newUser = new User();
    newUser.local.name = req.body.name;
    newUser.local.email = req.body.email;
    newUser.setPassword(req.body.password);

    newUser.save(function(err, savedUser) {
      if (err) {
        utils.sendJSONresponse(res, 404, err);
      } else {
        console.log("USER: "); 
        console.log(savedUser);
        const token = savedUser.generateJwt(savedUser);

        req.session.localUserId = savedUser._id;
        req.session.authToken = authCommon.generateJwtCookie(savedUser);

        utils.sendJSONresponse(res, 200, { token: token });
      }
    });
  });
};

/* POST to login as local user */
/* /api/login */
module.exports.login = function(req, res) {
  if(!req.body.email || !req.body.password) {
    utils.sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
  }
  
  passport.authenticate('local', function(err, user, info){
    if (err) {
      utils.sendJSONresponse(res, 404, err);
    }
    if(user){

      console.log("USER: "); 
      console.log(user);
      const token = user.generateJwt(user);

      req.session.localUserId = user._id;

      req.session.authToken = authCommon.generateJwtCookie(user);
      
      utils.sendJSONresponse(res, 200, { token: token });
    } else {
      utils.sendJSONresponse(res, 401, info);
    }
  })(req, res);
};

/* GET to unlink the local account*/
/* /api/unlink/local */
/* GET to unlink the account by serviceName*/
/* /api/unlink/local/:id */
module.exports.unlinkLocal = function(req, res, serviceName) {
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
                        
                        var lastUnlink = authCommon.checkIfLastUnlink('local', user);
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
                      
                      user = authCommon.removeServiceFromDb('local', user);
                      user.save(function(err) {
                        if(!err) {
                          req.session.authToken = authCommon.generateJwtCookie(user);
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