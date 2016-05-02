var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');
var authCommon = require('./auth-common.js');
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