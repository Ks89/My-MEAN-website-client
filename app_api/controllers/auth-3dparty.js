var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');
var Utils = require('../utils/util.js');
var utils = new Utils();

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
	var user = req.user;
	console.log('check if user exist, serviceName=' + serviceName);
	if(user) {
		console.log('check if last unlink');
		console.log('user user.facebook.id:['+ user.facebook.id + ']');
		console.log('user user.google.id:[' + user.google.id + ']');
		console.log('user user.github.id:[' + user.github.id + ']');
		console.log('user user.local.id:[' + user.local.id + ']');
		if(serviceName==='github' && !user.facebook.id && !user.google.id && !user.local.id) {
			user.remove(function() {
				console.log("removed user");
			});
			destroySessionAfterUnlink(user, res, req);
			utils.sendJSONresponse(res, 200, {});
		} else 
		if(serviceName==='google' && !user.github.id && !user.facebook.id && !user.local.id) {
			user.remove(function() {
				console.log("removed user");
			});
			destroySessionAfterUnlink(user, res, req);
			utils.sendJSONresponse(res, 200, {});
		} else 
		if(serviceName==='facebook' && !user.github.id && !user.google.id && !user.local.id) {
			user.remove(function() {
				console.log("removed user");
			});
			destroySessionAfterUnlink(user, res, req);
			utils.sendJSONresponse(res, 200, {});
		} else {
			console.log("unlinking normal situation, without a remove....");
			
			user = removeServiceFromDb(serviceName, user);
			user.save(function(err) {
				if(!err) {
					console.log("Unlinking...");
					console.log("--------------------------------------------");
					console.log(!user.github.id);
					console.log(!user.facebook.id);
					console.log(!user.google.id);
					console.log(!user.local.id);
					console.log("--------------------------------------------");

					req.session.authToken = getAuthToken(user);
					console.log("regenerate session token after unlink");
					utils.sendJSONresponse(res, 200, {});
				} else {
					console.log("Impossible to remove userService from db");
					utils.sendJSONresponse(res, 404, null);
				}
			});
		}

		//it's a normal unlink
	} else {
		console.log("Impossible to unlink, req.user is null");
		utils.sendJSONresponse(res, 404, null);
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

function redirectToProfile(user, res, req) {
	req.session.authToken = getAuthToken(user);
	console.log("redirecting to profile");
	res.redirect('/profile');
}

function destroySessionAfterUnlink(user, res, req) {
	if(req.session.authToken) {
		req.session.destroy(function(){
			console.log('Last unlink, session data destroyed');
		});
	}
	//res.redirect('/profile');
}

function getAuthToken(user) {
	var token3dauth = user.generateJwt(user);
	var authToken = JSON.stringify({ 
		'value': user._id,
		'token': token3dauth
	});
	return authToken;
}