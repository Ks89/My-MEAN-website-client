var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');

var Utils = require('../utils/util.js');
var utils = new Utils();

var authCommon = require('./auth-common.js');
var jwt = require('jsonwebtoken');

//------------- INFORMATIONS -------------
// GET /auth/****
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in ***** authentication will involve redirecting
//   the user to the website of *****.  After authorization, ***** will redirect the user
//   back to this application at the callbackURL.
// GET /auth/****/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function will be called,
//   which, in this example, will redirect the user to destination page.
//-----------------------------------------

var redirectFailure = { failureRedirect: '/login' };

var connectRedirect = {
	successRedirect : '/profile',
	failureRedirect : '/'
};

module.exports.authFacebook = passport.authenticate('facebook', { scope: ['email'] });
module.exports.authFacebookCallback = passport.authenticate('facebook', redirectFailure);
module.exports.connectFacebook = passport.authorize('facebook', { scope : 'email' });
module.exports.connectFacebookCallback = passport.authorize('facebook', connectRedirect);

module.exports.authTwitter = passport.authenticate('twitter', { scope : 'email' });
module.exports.authTwitterCallback = passport.authenticate('twitter', redirectFailure);
module.exports.connectTwitter = passport.authorize('twitter', { scope : 'email' });
module.exports.connectTwitterCallback = passport.authorize('twitter', connectRedirect);

module.exports.authGoogle = passport.authenticate('google', { scope: ['email', 'https://www.googleapis.com/auth/plus.login'] });
module.exports.authGoogleCallback = passport.authenticate('google', redirectFailure);
module.exports.connectGoogle = passport.authorize('google', { scope: ['email', 'https://www.googleapis.com/auth/plus.login'] });
module.exports.connectGoogleCallback = passport.authorize('google', connectRedirect);

module.exports.authGithub = passport.authenticate('github', { scope: [ 'user:email' ] });
module.exports.authGithubCallback = passport.authenticate('github', redirectFailure);
module.exports.connectGithub = passport.authorize('github', { scope: [ 'user:email' ] });
module.exports.connectGithubCallback = passport.authorize('github', connectRedirect);


module.exports.authLinkedin = passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] });
module.exports.authLinkedinCallback = passport.authenticate('linkedin', redirectFailure);
module.exports.connectLinkedin = passport.authorize('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] });
module.exports.connectLinkedinCallback = passport.authorize('linkedin', connectRedirect);


//GET that represents callbacks. This functions are used to manage the object "user" returned in req.user
//All of these have this form: /auth/****serviceName****/callback
module.exports.callbackRedirectFacebook = function(req, res) { 
	console.log("callbackRedirect called");
	redirectToProfile(req.user, res, req);
};
module.exports.callbackRedirectGoogle = function(req, res) { 
	console.log("callbackRedirect called");
	redirectToProfile(req.user, res, req);
};
module.exports.callbackRedirectGithub = function(req, res) { 
	console.log("callbackRedirect called");
	redirectToProfile(req.user, res, req);
};
module.exports.callbackRedirectTwitter = function(req, res) { 
	console.log("callbackRedirect called");
	redirectToProfile(req.user, res, req);
};
module.exports.callbackRedirectLinkedin = function(req, res) { 
	console.log("callbackRedirect called");
	redirectToProfile(req.user, res, req);
};

//GET to unlink a 3dauth user
//All of these have this form: /unlink/****serviceName****
module.exports.unlinkFacebook = function(req, res) {
	unlinkFromDb(req, 'facebook', res);
};
module.exports.unlinkGithub = function(req, res) {
	unlinkFromDb(req, 'github', res);
};
module.exports.unlinkGoogle = function(req, res) {
	unlinkFromDb(req, 'google', res);
};
module.exports.unlinkTwitter = function(req, res) {
	unlinkFromDb(req, 'twitter', res);
};
module.exports.unlinkLinkedin = function(req, res) {
	unlinkFromDb(req, 'linkedin', res);
};

function unlinkFromDb(req, serviceName, res) {
	console.log("€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€");
	console.log(req.session.authToken);
	console.log("€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€");

	if(req.session.authToken) {
		console.log("X€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€€");

		var tok = JSON.parse(req.session.authToken).token;
		console.log(tok);
		

		if (tok) {

		    var token = tok;
		    console.log("data received jwt: " + token);

		    // verify a token symmetric
		    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
		      if(err) {
		        console.log("ERROR");
		        utils.sendJSONresponse(res, 404, null);
		      } 
		      console.log('trying to decode');
		      if(decoded) {
		        console.log("decoding...");
		        console.log(decoded);
		        var convertedDate = new Date();
		        convertedDate.setTime(decoded.exp);
		        
		        console.log("date jwt: " + convertedDate.getTime() +
		          ", formatted: " + utils.getTextFormattedDate(convertedDate));
		        
		        var systemDate = new Date();
		        console.log("systemDate: " + systemDate.getTime() + 
		          ", formatted: " + utils.getTextFormattedDate(systemDate));

		        if( convertedDate.getTime() > systemDate.getTime() ) {
		          console.log("systemDate valid");

		          	var user = decoded.user;
					console.log('check if user exist, serviceName=' + serviceName);
					console.log("user is: ");
					console.log(user);


					User.findById(user._id, function(err, user) {
						console.log("User.findOne...");
						if (err) { 
							console.log('Error user not found (usersReadOneById)' + err);
							utils.sendJSONresponse(res, 404, null);
						}
				        if (user) { // if the user is found, then log them in
				        	console.log("User found (usersReadOneById): " + user);
					        
				        	var lastUnlink = authCommon.checkIfLastUnlink(serviceName, user);
							console.log('check if last unlink: ' + lastUnlink);
							if(lastUnlink) {
								console.log("last unlink found - removing....");
								user.remove(function() {
									console.log("removed user");
								});
								if(req.session.authToken) {
									req.session.destroy(function(){
										console.log('Last unlink, session data destroyed');
									});
								}
								utils.sendJSONresponse(res, 200, {});
							} else {
								console.log("unlinking normal situation, without a remove....");
								
								user = authCommon.removeServiceFromDb(serviceName, user);
								user.save(function(err) {
									if(!err) {
										req.session.authToken = authCommon.generateJwtCookie(user);
										console.log("Unlinking, regenerate session token after unlink");
										utils.sendJSONresponse(res, 200, user);
									} else {
										console.log("Impossible to remove userService from db");
										utils.sendJSONresponse(res, 404, null);
									}
								});
							}

				        } else { //otherwise, if there is no user found create them
				        	console.log("User not found - cannot unlink (usersReadOneById)");
				          	utils.sendJSONresponse(res, 404, null);
				        }
					});



		        } else {
		          console.log('No data valid');
		          utils.sendJSONresponse(res, 404, null);
		        }
		      } else {
		      	console.log("Impossible to decode: " + decoded);
		      	utils.sendJSONresponse(res, 404, null);
		      }
		    });

			} else {
				utils.sendJSONresponse(res, 404, null);
			}
	} else {
		utils.sendJSONresponse(res, 404, null);
	}
}

function redirectToProfile(user, res, req) {
	req.session.authToken = authCommon.generateJwtCookie(user);
	res.redirect('/profile');
}