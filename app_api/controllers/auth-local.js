var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var Utils = require('../utils/util.js');
var utils = new Utils();

module.exports.register = function(req, res) {
  if(!req.body.name || !req.body.email || !req.body.password) {
    utils.sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
    return;
  }

  var user = new User();
  user.local.name = req.body.name;
  user.local.email = req.body.email;
  user.setPassword(req.body.password);

  user.save(function(err) {
    var token;
    if (err) {
      utils.sendJSONresponse(res, 404, err);
    } else {
      token = user.generateJwt();
      utils.sendJSONresponse(res, 200, {
        "token" : token
      });
    }
  });
};

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
      token = user.generateJwt();
      utils.sendJSONresponse(res, 200, {
        "token" : token
      });
    } else {
      utils.sendJSONresponse(res, 401, info);
    }
  })(req, res);
};