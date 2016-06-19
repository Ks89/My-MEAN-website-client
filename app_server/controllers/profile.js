var mongoose = require('mongoose');
var User = mongoose.model('User');
var Utils = require('../utils/util.js');
var logger = require('../utils/logger.js');
var authCommon = require('./authentication/common/auth-common.js');

/* POST to updated the profile */
/* /api/profile */
module.exports.update = function(req, res) {
	console.log("Called profile upated");
  if(!req.body.serviceName) {
    Utils.sendJSONres(res, 400, "ServiceName is required");
    return;
  }
  if(req.body.serviceName === 'local' && !req.body.localUserEmail) {
    Utils.sendJSONres(res, 400, "LocalUserEmail is required if you pass serviceName = local");
    return;
  }
  if(req.body.serviceName !== 'local' && !req.body.id) {
    Utils.sendJSONres(res, 400, "id is required if you pass serviceName != local");
    return;
  }
  if(!req.body.name || !req.body.surname || !req.body.nickname || !req.body.email) {
    Utils.sendJSONres(res, 400, "All profile params are mandatory");
    return;
  }

  var query = {};

  if(req.body.serviceName !== 'local') {
    //third party authentication
    query[req.body.serviceName + '.id'] = req.body.id;
    console.log(query);
  } else {
    //local authentication    
    query[req.body.serviceName + '.email'] = req.body.localUserEmail;
    console.log(query);
  }

  var profileObj = {
      name : req.body.name,
      surname : req.body.surname,
      nickname : req.body.nickname,
      email : req.body.email,
      updated : new Date(),
      visible : true
    };
    
  User.findOne(query, (err, user) => {
    if (!user || err) {
      Utils.sendJSONres(res, 401, 'Cannot update your profile. Please try to logout and login again.');
      return;
    }

    console.log("user profile to update: " + user);

    user.profile = profileObj; //update profile
    user.save((err, savedUser) => {
      if (err) { 
        Utils.sendJSONres(res, 404, 'Error while updating your profile. Please retry.');
      } else {
        console.log("updating auth token with new profile infos");
        req.session.authToken = authCommon.generateJwtCookie(savedUser);
        Utils.sendJSONres(res, 200, {message: 'Profile updated successfully!'});
      }
    });
  });
};