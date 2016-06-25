var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');

var Utils = require('../utils/util.js');

/* GET a user by id */
/* /api/users/:id */
module.exports.usersReadOneById = function(req, res) {
	console.log('Finding a User', req.params);
	if (req.params && req.params.id) {

		User.findById(req.params.id, (err, user) => {
			console.log("User.findOne...");
			if (err) { 
				console.log('Error user not found (usersReadOneById)' + err);
				Utils.sendJSONres(res, 404, "User not found");
			} else if (user) { // if the user is found, then log them in
	        	console.log("User found (usersReadOneById): " + user);
		        Utils.sendJSONres(res, 200, user);
	        } else { //otherwise, if there is no user found create them
	        	console.log("User not found (usersReadOneById)");
	          	Utils.sendJSONres(res, 404, "User not found");
	        }
	    });
	} else {
		Utils.sendJSONres(res, 404, "No userid in request");
	}
};

