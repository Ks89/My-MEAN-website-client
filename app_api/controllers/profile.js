var mongoose = require('mongoose');
var User = mongoose.model('User');
var Utils = require('../utils/util.js');
var logger = require('../utils/logger.js');
var authCommon = require('./auth-common.js');

/* POST to updated the profile */
/* /api/profile */
module.exports.update = function(req, res) {
	console.log("Called profile upated");

	if(!req.body) {
		Utils.sendJSONresponse(res, 404, err);
	}

  console.log("profile is:");
  console.log(req.body);

  var query = {};
  query[req.body.serviceName + '.id'] = req.body.id;

  console.log(query);

  var profileObj = {
    name : req.body.name,
    surname : req.body.surname,
    nickname : req.body.nickname,
    email : req.body.email,
    updated : new Date(),
    visible : true
  };

  User.findOne(query, (err, user) => {
    if (err) {
      Utils.sendJSONresponse(res, 404, 'Cannot update your profile.' +
                             'Please try to logout and login again.');
    }
    user.profile = profileObj; //update profile
    user.save((err, savedUser) => {
      if (err) { 
        Utils.sendJSONresponse(res, 404, 'Error while updating your profile. Please retry.');
      } else {
        console.log("updating auth token with new profile infos");
        req.session.authToken = authCommon.generateJwtCookie(savedUser);
        Utils.sendJSONresponse(res, 200, 'Profile updated successfully!');
      }
    });
  });
};