var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../../../utils/logger.js');
var authCommon = require('./auth-common.js');
var Utils = require('../../../utils/util.js');
var serviceNames = require('../serviceNames');
var _und = require('underscore');

module.exports.collapseDb = (loggedUser, serviceName, req) => {
	return new Promise((resolve, reject) => {
		if(Utils.isNotSimpleCustomObject(loggedUser)) {
			console.error("impossible to collapseDb because loggedUser is not an object");
			reject('impossible to collapseDb because loggedUser is not an object');
			return;
		}

		if(!_und.isString(serviceName)) {
			console.error("impossible to collapseDb because serviceName must be a string");
			reject('impossible to collapseDb because serviceName must be a string');
			return;
		}

		if(serviceNames.indexOf(serviceName) === -1) {
			console.error("impossible to collapseDb because serviceName is not recognized");
			reject('impossible to collapseDb because serviceName is not recognized');
			return;
		}

		console.log("--------------------------******----");
		console.log("INPUT loggedUser");
		console.log(loggedUser);
		console.log("serviceName: " + serviceName);

		let inputId;
		let query = {};

		if(loggedUser[serviceName]) {
			console.log('àààààààààààà2 		------    ' + JSON.stringify(loggedUser[serviceName]));
			if(serviceName === 'local') {
				if(loggedUser[serviceName].email!==null && loggedUser[serviceName].email!==undefined) {
					console.log('àààààààààààà3 		------    ' + JSON.stringify(loggedUser[serviceName].email));
					inputId = loggedUser[serviceName].email;

					const key =  serviceName + '.email';
					query[key] = inputId;
				}
			} else { 
				console.log('àààààààààààà4 		------    ' + JSON.stringify(loggedUser[serviceName]));
				if(loggedUser[serviceName].id!==null && loggedUser[serviceName].id!==undefined) {
					console.log('àààààààààààà5 		------    ' + loggedUser[serviceName].id);

					inputId = loggedUser[serviceName].id;

					const key =  serviceName + '.id';
					query[key] = inputId;
				}
			}
		}

		console.log("àààààààààààà 		------ 		inputId " + inputId);

		if(inputId === undefined || inputId === null) {
			console.error('inputId is not valid');
			reject('input id not valid while collapsing');
		}



		// query._id = {
		// 	'$ne' : loggedUser._id
		// };

		User.find(query, (err, users) => {

			if(err) {
				console.error("--------------------------******---- Error - users not found!!!");
				reject('User  not found while collapsing');
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
				console.error("--------------------------******---- Error - user not found!!!");
				reject('User not found while collapsing db');
				return;
			}

			console.log("2*****************************************");
			console.log(user);
			console.log("2*****************************************");

			let duplicatedUser = users.filter(dbUser => {
				let idOrEmail;
				if(serviceName === 'local') {
					idOrEmail = dbUser[serviceName].email;
				} else {
					idOrEmail = dbUser[serviceName].id;
				}

				if (dbUser && dbUser[serviceName] && idOrEmail === inputId && (dbUser._id + '') !== (user._id + '') ) {
					return dbUser;
				}
			});

			if(!duplicatedUser || !duplicatedUser[0]) {
				console.log("No duplicated user found");
				reject('No duplicated user found while collapsing');
				return;
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
				if(s !== serviceName && (!user[s] || !user[s].id) && duplicatedUser[s] && (duplicatedUser[s].id || duplicatedUser[s].email)) {
					console.log("**--------------------------******---- merging service: " + s);
					console.log("£££££££££££££££££££££££££££££££££duplicatedUser " + duplicatedUser[s]);
					console.log("£££££££££££££££££££££££££££££££££user before " + user[s]);
					user[s] = duplicatedUser[s];
					console.log("£££££££££££££££££££££££££££££££££user after " + user[s]);
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
							return;
						}
						console.log('req.session.authToken finished collapse with: ' + req.session.authToken);

						console.log('°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°savedUser is: ');
						console.log(savedUser);

						console.log("--------------------------******---- removing duplicated user [OK]");

						User.findByIdAndRemove(duplicatedUser._id, err => {
							if (err) {
								reject('Impossible to remove duplicated user while collapsing');
								return;
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
				return;
			}
		});
	});
};
