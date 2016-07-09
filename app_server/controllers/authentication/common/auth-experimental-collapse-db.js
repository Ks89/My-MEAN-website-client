var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../../../utils/logger.js');
var authCommon = require('./auth-common.js');
var Utils = require('../../../utils/util.js');
var async = require('async');


module.exports.collapseDb = (loggedUser, serviceName, req) => {

	return new Promise((resolve, reject) => {
		if(!loggedUser || !serviceName) {
			console.err("impossibile to collapseDb becase either loggedUser or serviceName are null or undefined.");
		}

		console.log("--------------------------******----");
		console.log("INPUT loggedUser");
		console.log(loggedUser);
		console.log("serviceName: " + serviceName);

		const inputId = loggedUser[serviceName] ? loggedUser[serviceName].id : null;
		
		console.log("inputId " + inputId);

		if(!inputId) {
			console.err("inputId is not valid");
			reject('input id not valid while collapsing');
		}

		const key =  serviceName + '.id';
		const query = {};
		
		query[key] = inputId;

		// query._id = {
		// 	'$ne' : loggedUser._id
		// };

		User.find(query, (err, users) => {

			if(err) {
				console.err("--------------------------******---- Error - users not found!!!");
				reject('User by id not found while collapsing');
			}

			console.log("--------------------------******---- users found");
			console.log(users);

			//retrive the logged user from the db using his _id (id of mongodb's object)
			var user = users.find(el => { 
				if(el && el._id) {
					return el._id + '' === loggedUser._id + '';
				}	
			});

			if(!user) {
				console.err("--------------------------******---- Error - user not found!!!");	
				reject('User not found while collapsing db');
			}

			console.log("2*****************************************");
			console.log(user);
			console.log("2*****************************************");

			let duplicatedUser = users.filter(dbUser => {
				if (dbUser && dbUser[serviceName] && dbUser[serviceName].id === inputId && (dbUser._id + '') !== (user._id + '') ) {
					return dbUser;
				}
			});

			if(!duplicatedUser || !duplicatedUser[0]) {
				console.log("No duplicated user found");
				reject('No duplicated user found while collapsing');
			}

			duplicatedUser = duplicatedUser[0];

			console.log("**--------------------------******----preparing to collapse duplicated db's users");
			console.log(user);
			console.log("**--------------------------******----");


			console.log("3*****************************************");
			console.log(duplicatedUser);
			console.log("3*****************************************");

			let updated = false;

			//ATTENTION: at the moment I decided to manage profile infos as services.
			//I'll remove this logic splitting profile logic from authentication logic.
			for(let s of ['google', 'github', 'facebook', 'local', 'linkedin', 'twitter', 'profile']) {
				console.log('**--------------------------******----cycle s: ' + s + ', serviceName: ' + serviceName);
				if(s !== serviceName && (!user[s] || !user[s].id) && duplicatedUser[s]) {
					console.log("**--------------------------******---- merging service: " + s);
					user[s] = duplicatedUser[s];
					updated = true;
				}
			}

			console.log("**--------------------------******---- modified user");
			console.log(user);
			console.log("**--------------------------******---- saving this modified user");

			if(duplicatedUser && updated) {
				user.save((err, savedUser) => {
					if (err) {
						console.log("Error while saving collapsed users");
						reject('Error while saving collapsed users');
					} else {
						console.log("Saved modified user: " + savedUser); 
						console.log("updating auth token with user infos");
						try {
							req.session.authToken = authCommon.generateJwtCookie(savedUser);
						} catch(e) {
							logger.error(e);
							reject("Impossible to generateJwtCookie due to an internal server error");
						}
						console.log('req.session.authToken finished collapse with: ' + req.session.authToken);

						console.log("--------------------------******---- removing duplicated user [OK]");

						User.findByIdAndRemove(duplicatedUser._id, err => {
							if (err) {
								reject('Impossible to remove duplicaed user while collapsing');
							} else {
								// we have deleted the user
								console.log('--------------------------******---- duplicated User deleted! [OK]');
								console.log("savedUser: " + savedUser);
								resolve(savedUser);
							}	  
						}); 
					}
				});
			} else {
				console.log("I can't do anything because there isn't a duplicated users! [OK]");
				reject("I can't do anything because there isn't a duplicated users! [OK]");
			}
		});
	});
};
