var mongoose = require('mongoose');
var User = mongoose.model('User');

var Utils = require('../utils/util.js');
var utils = new Utils();

/* GET a user by id */
/* /api/users/:id */
module.exports.usersReadOneById = function(req, res) {
	console.log('Finding a User', req.params);
	if (req.params && req.params.id) {
		//build the query from req.params values
		// var query = {};
		// query[req.params.service+'.id'] = req.params.id;

		User.findById(req.params.id, function(err, user) {
			console.log("User.findOne...");
			if (err) { 
				console.log('Error user not found (usersReadOneById)' + err);
				return done(err); 
			}
	        if (user) { // if the user is found, then log them in
	        	console.log("User found (usersReadOneById): " + user);
		        utils.sendJSONresponse(res, 200, user);
	        } else { //otherwise, if there is no user found create them
	        	console.log("User not found (usersReadOneById)");
	          	utils.sendJSONresponse(res, 404, "");
	        }
	    });
	} else {
		utils.sendJSONresponse(res, 404, "");
	}
};

