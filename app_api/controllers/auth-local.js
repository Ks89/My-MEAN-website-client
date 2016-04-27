var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');

var jwt = require('jsonwebtoken');

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
};

function regenerateJwtCookie(user) {
  var token3dauth = user.generateJwt(user);
  var authToken = JSON.stringify({ 
    'value': user._id,
    'token': token3dauth
  });
  return authToken;
}