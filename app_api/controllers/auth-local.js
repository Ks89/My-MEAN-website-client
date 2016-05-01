var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');

var Utils = require('../utils/util.js');
var utils = new Utils();

/* POST to register a local user */
/* /api/register */
module.exports.register = function(req, res) {
  console.log('called register server side');
  if(!req.body.name || !req.body.email || !req.body.password) {
    utils.sendJSONresponse(res, 400, "All fields required");
    return;
  }

  User.findOne({ 'local.email': req.body.email }, function (err, user) {
    if (err || user) { 
      utils.sendJSONresponse(res, 400, "User already exists. Try to login.");
      return;
    }

    var newUser = new User();
    newUser.local.name = req.body.name;
    newUser.local.email = req.body.email;
    newUser.setPassword(req.body.password);

    newUser.save(function(err, savedUser) {
      var token;
      if (err) {
        utils.sendJSONresponse(res, 404, err);
      } else {
        console.log("USER: "); 
        console.log(savedUser);
        token = savedUser.generateJwt(savedUser);

        req.session.localUserId = savedUser._id;
        
        req.session.authToken = regenerateJwtCookie(savedUser);

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
    return;
  }
  
  passport.authenticate('local', function(err, user, info){
    var token;
    if (err) {
      utils.sendJSONresponse(res, 404, err);
      return;
    }
    if(user){

      console.log("USER: "); 
      console.log(user);
      token = user.generateJwt(user);

      req.session.localUserId = user._id;

      req.session.authToken = regenerateJwtCookie(user);
      
      utils.sendJSONresponse(res, 200, { token: token });
    } else {
      utils.sendJSONresponse(res, 401, info);
    }
  })(req, res);
};

/* GET to unlink the local account by id*/
/* /api/unlink/local/:id */
module.exports.unlinkLocal = function(req, res) {
  console.log("User found to unlink: ");
  if (req.params && req.params.id) {
    var id = req.params.id;
    console.log("data received id: " + id);
    User.findOne({ '_id': id }, function (err, user) {
      if(err) {
        utils.sendJSONresponse(res, 200, null);
      }
      user.local = undefined;
      user.save(function(err) {
        if(err) {
          utils.sendJSONresponse(res, 200, null);
        } 
        req.session.authToken = regenerateJwtCookie(user);
        utils.sendJSONresponse(res, 200, user);
      });
    });
  }






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
                      
                      user.local = undefined;
                      user.save(function(err) {
                        if(!err) {
                          req.session.authToken = getAuthToken(user);
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



function checkIfLastUnlink(serviceName, user) {
  switch(serviceName) {
    case 'local':
      return !user.github.id && !user.google.id && !user.facebook.id;
    default:
      console.log('Service name not recognized in checkIfLastUnlink');
      return false;
  }
}


function regenerateJwtCookie(user) {
  var token3dauth = user.generateJwt(user);
  var authToken = JSON.stringify({ 
    'value': user._id,
    'token': token3dauth
  });
  return authToken;
}