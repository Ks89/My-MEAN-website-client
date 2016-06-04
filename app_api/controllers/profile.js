var mongoose = require('mongoose');
var User = mongoose.model('User');
var Utils = require('../utils/util.js');
var logger = require('../utils/logger.js');

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

  User.update(query, { $set: { profile: profileObj }}, function (err, user) {
    console.log("update");
    console.log(user);
    if (err) { 
      Utils.sendJSONresponse(res, 404, err);
    } else {
      Utils.sendJSONresponse(res, 200, user);
    } 
  });
};