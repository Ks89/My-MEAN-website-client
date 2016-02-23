var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

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


//----- functions used to manage the object "user" returned in req.user.servicename.token --------
module.exports.callbackRedirectFacebook = function(req, res) { 
	//console.log(req.session);
	redirectToProfile(req.user, res);
};
module.exports.callbackRedirectGoogle = function(req, res) { 
	redirectToProfile(req.user, res);
};
module.exports.callbackRedirectGithub = function(req, res) { 
	redirectToProfile(req.user, res);
};
module.exports.callbackRedirectTwitter = function(req, res) { 
	redirectToProfile(req.user, res);
};
module.exports.callbackRedirectLinkedin = function(req, res) { 
	redirectToProfile(req.user, res);
};

function redirectToProfile(user, res) {
	console.log("callbackRedirect called");

	var token3dauth = user.generateJwt3dauth(user);
	//req.session.token = JSON.stringify({ token : token3dauth });

	var myCookie = JSON.stringify({ 
		'value': user._id,
		'token': token3dauth
	});

	res.cookie('userCookie', myCookie /*, { maxAge: 900000, httpOnly: true }*/);	
	res.redirect('/profile');
};

module.exports.unlinkFacebook = function(req, res) {
	console.log("User found to unlink: " + req.user);
	var user = req.user;
	user.facebook = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
};
module.exports.unlinkGithub = function(req, res) {
	console.log("User found to unlink: " + req.user);
	var user = req.user;
	user.github = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
};
module.exports.unlinkGoogle = function(req, res) {
	console.log("User found to unlink: " + req.user);
	var user = req.user;
	user.google = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
};
module.exports.unlinkTwitter = function(req, res) {
	console.log("User found to unlink: " + req.user);
	var user = req.user;
	user.twitter = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
};
module.exports.unlinkLinkedin = function(req, res) {
	console.log("User found to unlink: " + req.user);
	var user = req.user;
	user.linkedin = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
};