var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');

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
	redirectToProfile(req.user, res);
};
module.exports.callbackRedirectGoogle = function(req, res) { 
	console.log("callbackRedirect called");
	redirectToProfile(req.user, res);
};
module.exports.callbackRedirectGithub = function(req, res) { 
	console.log("callbackRedirect called");
	redirectToProfile(req.user, res);
};
module.exports.callbackRedirectTwitter = function(req, res) { 
	console.log("callbackRedirect called");
	redirectToProfile(req.user, res);
};
module.exports.callbackRedirectLinkedin = function(req, res) { 
	console.log("callbackRedirect called");
	redirectToProfile(req.user, res);
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
	var user = req.user;
	if(user) {
		user = removeServiceFromDb(serviceName, user);
		user.save(function(err) {
			if(!err) {
				console.log("Unlinking...");
				redirectToProfile(user, res);
			} else {
				console.log("Impossible to remove userService from db");
			}
		});
	} else {
		console.log("Impossible to unlink, req.user is null");
	}
}

function removeServiceFromDb(serviceName, user) {
	switch(serviceName) {
			case 'facebook': 
				user.facebook = undefined;
				break;
			case 'github': 
				user.github = undefined;
				break;
			case 'google': 
				user.google = undefined;
				break;
			case 'twitter': 
				user.twitter = undefined;
				break;
			case 'linkedin': 
				user.linkedin = undefined;
				break;
			default:
				console.log('Service name not recognized to unlink');
				break;
		}
		return user;
}

function redirectToProfile(user, res) {
	var cookie = getAuthToken(user);
	res.cookie('userCookie', cookie /*, { maxAge: 900000, httpOnly: true }*/);	
	res.redirect('/profile');
}

// get the auth token
function getAuthToken(user) {
	var token3dauth = user.generateJwt(user);
	var myCookie = JSON.stringify({ 
		'value': user._id,
		'token': token3dauth
	});
	return myCookie;
}