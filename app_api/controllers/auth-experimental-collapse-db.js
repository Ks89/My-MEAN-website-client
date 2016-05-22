var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');

var Utils = require('../utils/util.js');
var async = require('async');


module.exports.collapseDb = (user, serviceName) => {

	if(!user) {
		console.err("impossibile to collapseDb becase user is null or undefined");
	}

	console.log("--------------------------******----");
	console.log("--------------------------******----");
	console.log("--------------------------******----");
	console.log('called collapseDb');
	console.log("INPUT user");
	console.log(user);
	console.log("serviceName: " + serviceName);

	const inputEmail = user[serviceName] ? user[serviceName].email : null;
	

	console.log("inputEmail " + inputEmail);

	console.log("--------------------------******----");
	console.log("--------------------------******----");
	console.log("--------------------------******----");

	const key =  serviceName + '.email';
	const query = {};
	
	query[key] = inputEmail;

	query._id = {
		'$ne' : user._id
	};

	console.log(query);

	if(inputEmail) {
		User.find(query, (err, users) => {
			if(err) {
				console.log("--------------------------******---- Error - user not found!!!");

			}
			console.log("--------------------------******---- search");

			console.log("--------------------------******---- users found");
			console.log(users);
			console.log("--------------------------******---- starting cycle");

			let duplicatedUser = {};

			for(let iUser of users) {
				console.log("--------------------------******---- iUser in for: ");
				console.log(iUser);
				console.log("--------------------------******---- if condition");
				console.log("--------------------------******----iUser[serviceName]: ");
				console.log((iUser ? iUser[serviceName] : 'not found'));

				const idiUser = iUser._id + '';
				const iduser = user._id + '';
				console.log("--------------------------******----iUser._id: " + iUser._id);
				console.log("--------------------------******----user._id: " + user._id);
				if (iUser && iUser[serviceName] && iUser[serviceName].email === inputEmail/* && idiUser !== iduser*/) {
					console.log('--------------------------******----found a duplicated ' + serviceName + ' iUser:');
					console.log(iUser[serviceName]);
					duplicatedUser = iUser;
					break;
					//here I found one account with the same service
					//I want to merge all infos in this account [not logged] with the new one [used to connect] (to prevent logout/login and session invalidation)
				} 
				console.log('--------------------------******----cycle completed');
			}

			console.log("--------------------------******----preparing to collapse duplicated db's users");
			console.log(user);
			console.log("--------------------------******----");

			let updated = false;

			for(let s of ['google', 'github', 'facebook', 'local', 'linkedin', 'twitter']) {
				console.log('--------------------------******----cycle s: ' + s + ', serviceName: ' + serviceName);
				if(s !== serviceName) {
					console.log('--------------------------******----user[s]: ' + user[s]);
					console.log('--------------------------******----duplicatedUser[s]: ' + duplicatedUser[s]);
					console.log('--------------------------******----!user[s]: ' + !user[s]);
					console.log('--------------------------******----(!user[s] || !user[s].email): ' + (!user[s] || !user[s].email));
					if((!user[s] || !user[s].email) && duplicatedUser[s]) {
						console.log("--------------------------******---- merging service: " + s);
						console.log("--------------------------******----  modified user in cycle: ");
						console.log(duplicatedUser[s]);
						console.log("--------------------------******----");
						user[s] = duplicatedUser[s];
						updated=true;
						console.log("--------------------------******----  modified user in cycle: ");
						console.log(user[s]);
						console.log("--------------------------******----");
					}
				}
			}

			console.log("--------------------------******---- modified user");
			console.log(user);
			console.log("--------------------------******---- saving this modified user");

			if(duplicatedUser && updated) {
				user.save((err, savedUser) => {
		      if (err) {
		      	console.log("Error while saving collapsed users");
		        throw err;
		      }
		      console.log("Saved modified user: " + savedUser); 
		  	});

		  	console.log("--------------------------******---- removing duplicated user");

		  	User.findByIdAndRemove(duplicatedUser._id, function(err) {
				  if (err) throw err;

				  // we have deleted the user
				  console.log('--------------------------******---- duplicated User deleted!');
				});
	  	}

			console.log("--------------------------******---- search finished");
		});
	}
};
