var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');

var Utils = require('../utils/util.js');
var async = require('async');


module.exports.collapseDb = (loggedUser, serviceName) => {

	if(!loggedUser || !serviceName) {
		console.err("impossibile to collapseDb becase either loggedUser or serviceName are null or undefined.");
	}

	console.log("--------------------------******----");
	console.log("INPUT loggedUser");
	console.log(loggedUser);
	console.log("serviceName: " + serviceName);

	const inputEmail = loggedUser[serviceName] ? loggedUser[serviceName].email : null;
	
	console.log("inputEmail " + inputEmail);

	if(!inputEmail) {
		console.err("inputEmail is not valid");
		return;
	}

	console.log("--------------------------******----");
	console.log("--------------------------******----");
	console.log("--------------------------******----");

	const key =  serviceName + '.email';
	const query = {};
	
	query[key] = inputEmail;

	// query._id = {
	// 	'$ne' : loggedUser._id
	// };

	console.log(query);

	const idLoggedUser = loggedUser._id + '';

	User.find(query, (err, users) => {

		if(err) {
			console.err("--------------------------******---- Error - users not found!!!");
			throw err;
		}

		console.log("--------------------------******---- users found");
		console.log(users);

		var user = users.find(function (el) { 
			if(el && el._id) {
				return el._id + '' === idLoggedUser + '';
			}	
		});

		if(!user) {
			console.err("--------------------------******---- Error - user not found!!!");	
			return;		
		}

		let duplicatedUser = {};

		console.log("2*****************************************");
		console.log(user);
		console.log("2*****************************************");
		const idUser = user._id + '';

		for(let dbUser of users) {
			console.log("--------------------------******---- dbUser in for: ");
			console.log(dbUser);
			console.log("--------------------------******---- if condition");
			console.log("--------------------------******----dbUser[serviceName]: ");
			console.log((dbUser ? dbUser[serviceName] : 'not found'));

			const iddbUser = dbUser._id + '';

			console.log("--------------------------******----dbUser._id: " + iddbUser);
			console.log("--------------------------******----user._id: " + idUser);
			if (dbUser && dbUser[serviceName] && dbUser[serviceName].email === inputEmail && iddbUser !== idUser) {
				console.log('--------------------------******----found a duplicated ' + serviceName + ' dbUser:');
				console.log(dbUser[serviceName]);
				duplicatedUser = dbUser;
				break;
					//here I found one account with the same service
					//I want to merge all infos in this account [not logged] with the new one [used to connect] (to prevent logout/login and session invalidation)
				}
				console.log('--------------------------******----cycle completed');
		}

		console.log("**--------------------------******----preparing to collapse duplicated db's users");
		console.log(user);
		console.log("**--------------------------******----");

		let updated = false;

		for(let s of ['google', 'github', 'facebook', 'local', 'linkedin', 'twitter']) {
			console.log('**--------------------------******----cycle s: ' + s + ', serviceName: ' + serviceName);
			if(s !== serviceName) {
				// console.log('--------------------------******----user[s]: ' + user[s]);
				// console.log('--------------------------******----duplicatedUser[s]: ' + duplicatedUser[s]);
				// console.log('--------------------------******----!user[s]: ' + !user[s]);
				// console.log('--------------------------******----(!user[s] || !user[s].email): ' + (!user[s] || !user[s].email));
				if((!user[s] || !user[s].email) && duplicatedUser[s]) {
					console.log("**--------------------------******---- merging service: " + s);
					// console.log("**--------------------------******----  modified user in cycle (duplicatedUser): ");
					// console.log(duplicatedUser[s]);
					// console.log("**--------------------------******----");
					// console.log("**--------------------------******----  user in cycle before changes: ");
					// console.log(user[s]);
					// console.log("**--------------------------******----");

					user[s] = duplicatedUser[s];
					updated=true;
				}
			}
		}

		console.log("**--------------------------******---- modified user");
		console.log(user);
		console.log("**--------------------------******---- saving this modified user");

		if(duplicatedUser && updated) {
			user.save((err, savedUser) => {
				if (err) {
					console.log("Error while saving collapsed users");
					throw err;
				}
				console.log("Saved modified user: " + savedUser); 
			});

			console.log("--------------------------******---- removing duplicated user [OK]");

			User.findByIdAndRemove(duplicatedUser._id, err => {
				if (err) {
					throw err;
				}

			  // we have deleted the user
			  console.log('--------------------------******---- duplicated User deleted! [OK]');
			});
		} else {
			console.log("I can't do anything because there isn't a duplicated users! [OK]");
		}

		console.log("--------------------------******---- search finished");
	});
};
