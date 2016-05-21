var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');

var Utils = require('../utils/util.js');
var async = require('async');


module.exports.collapseDb = (user, serviceName) => {
	console.log("-----------------------------------------------------------------------------");
	console.log("-----------------------------------------------------------------------------");
	console.log("-----------------------------------------------------------------------------");
	console.log('called collapseDb');
	console.log("INPUT user");
	console.log(user);
	console.log("serviceName: " + serviceName);

	var inputEmail = user[serviceName] ? user[serviceName].email : null;
	

	console.log("inputEmail " + inputEmail);

	console.log("-----------------------------------------------------------------------------");
	console.log("-----------------------------------------------------------------------------");
	console.log("-----------------------------------------------------------------------------");

	const key =  serviceName + '.email';
	const query = {};
	
	query[key] = inputEmail;

	console.log(query);

	if(inputEmail) {
		User.find(query, (err, users) => {
			if(err) {
				console.log("----------------------------------------------------------------------------- Error - user not found!!!");

			}
			console.log("----------------------------------------------------------------------------- search");

			console.log("----------------------------------------------------------------------------- users found");
			console.log(users);
			console.log("----------------------------------------------------------------------------- starting cycle");

			for(var iUser of users) {
				console.log("----------------------------------------------------------------------------- iUser in for: ");
				console.log(iUser);
				console.log("----------------------------------------------------------------------------- if condition");
				console.log("-----------------------------------------------------------------------------iUser[serviceName]: ");
				console.log((iUser ? iUser[serviceName] : 'not found'));

				const idiUser = iUser._id + '';
				const iduser = user._id + '';
				console.log("-----------------------------------------------------------------------------iUser._id: " + iUser._id);
				console.log("-----------------------------------------------------------------------------user._id: " + user._id);
				if (iUser && iUser[serviceName] && iUser[serviceName].email === inputEmail && idiUser !== iduser) {
					console.log('-----------------------------------------------------------------------------found a duplicated ' + serviceName + ' iUser:');
					console.log(iUser[serviceName]);
				} 
				console.log('-----------------------------------------------------------------------------cycle 1 completed');
			}

			console.log("----------------------------------------------------------------------------- search finished");
		});
	}



	// if(inputEmail) {
	// 	User.find({ 'github.email': inputEmail}, (err, users) => {
	// 		if(err) {
	// 			console.log("------------------------------------------------------------------Error - user not found!!!");
	// 		}
	// 		console.log("----------------------------------------------------------------------------- github search");

	// 		for(var user in users) {
	// 						console.log("----------------------------------------------------------------------------- github user in for: ");
	// 						console.log(user)
	// 			if (user && user.github && user.github.email !== inputEmail) {
	// 				console.log('found a duplicated github User:');
	// 				console.log(user.github);
	// 			} 
	// 		}

	// 		console.log("----------------------------------------------------------------------------- github search finished");
	// 	});
	// }
	// if(inputEmail) {
	// 	User.find({ 'google.email': inputEmail }, (err, users) => {
	// 		if(err) {
	// 			console.log("------------------------------------------------------------------Error - user not found!!!");
	// 		}
	// 		console.log("----------------------------------------------------------------------------- google search");

	// 		for(var user in users) {
	// 			if (user && user.google && user.google.email !== inputEmail) {
	// 				console.log('found a duplicated google User');
	// 			}
	// 		} 
	// 		console.log("----------------------------------------------------------------------------- google search finished");

	// 	});
	// }
	// if(inputEmail) {
	// 	User.find({ 'local.email': inputEmail }, (err, users) => {
	// 		if(err) {
	// 			console.log("------------------------------------------------------------------Error - user not found!!!");
	// 		}
	// 		console.log("----------------------------------------------------------------------------- local search");

	// 		for(var user in users) {
	// 			if (user && user.local && user.local.email !== inputEmail) {
	// 				console.log('found a duplicated local User');
	// 			}
	// 		} 
	// 		console.log("----------------------------------------------------------------------------- local search finished");

	// 	});
	// }
	// if(inputEmail) {
	// 	User.find({ 'facebook.email': inputEmail }, (err, users) => {
	// 		if(err) {
	// 			console.log("------------------------------------------------------------------Error - user not found!!!");
	// 		}
	// 		console.log("----------------------------------------------------------------------------- facebook search");

	// 		for(var user in users) {
	// 			if (user && user.facebook && user.facebook.email !== inputEmail) {
	// 				console.log('found a duplicated facebook User');
	// 			}
	// 		} 
	// 		console.log("----------------------------------------------------------------------------- facebook search finished");

	// 	});
	// }




 //      User.findOne({ 'local.email': req.body.email }, (err, user) => {
 //        if (err || user) {
 //          console.log('User');
 //          Utils.sendJSONresponse(res, 400, buildMessage("User. Try to login."));
 //          return;
 //        } 

 //        var newUser = new User();
 //        newUser.local.name = req.body.name;
 //        newUser.local.email = req.body.email;
 //        newUser.setPassword(req.body.password);
 //        newUser.local.activateAccountToken = token;
 //        newUser.local.activateAccountExpires =  new Date(Date.now() + 24*3600*1000); // 1 hour

 //        newUser.save((err, savedUser) => {
 //          if (err) {
 //            throw err;
 //          }
 //          console.log("Registered user: " + savedUser); 

 //          //create message data
 //          const msgText = 'You are receiving this because you (or someone else) have requested an account for this website.\n' +
 //            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
 //            link + '\n\n' +
 //            'If you did not request this, please ignore this email.\n';
 //          const message = emailMsg(req.body.email, 'Welcome to stefanocappa.it', msgText);

 //          done(err, savedUser, message);
 //        });
	// });
};
