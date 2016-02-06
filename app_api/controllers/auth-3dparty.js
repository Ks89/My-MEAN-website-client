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

/* GET a user by token */
/* /api/users/:token */
module.exports.usersReadOneByToken = function(req, res) {
	console.log('Finding a User', req.params);
	if (req.params && req.params.service && req.params.token) {
		//build the query from req.params values
		var query = {};
		query[req.params.service+'.token'] = req.params.token;

		User.findOne(query, function(err, user) {
			console.log("User.findOne...");
			if (err) { 
				return done(err); 
			}
	        if (user) { // if the user is found, then log them in
	        	console.log("User found: " + user);
		        sendJSONresponse(res, 200, user);
	        } else { //otherwise, if there is no user found with that github id, create them
	          	sendJSONresponse(res, 404, "");
	        }
	    });
	} else {
		sendJSONresponse(res, 404, "");
	}
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


//----- functions used to manage the object "user" returned in req.user.servicename.token --------
module.exports.callbackRedirectFacebook = function(req, res) { 
	//console.log(req.session);
	redirectToProfile(req.user.facebook.token, "facebook", res);
};
module.exports.callbackRedirectGoogle = function(req, res) { 
	redirectToProfile(req.user.google.token, "google", res);
};
module.exports.callbackRedirectGithub = function(req, res) { 
	redirectToProfile(req.user.github.token, "github", res);
};
module.exports.callbackRedirectTwitter = function(req, res) { 
	redirectToProfile(req.user.twitter.token, "twitter", res);
};

function redirectToProfile(token, serviceName, res) {
	console.log("callbackRedirect" + serviceName + " called");
	var myCookie = getCookie(serviceName, token);

	res.cookie('usertoken', myCookie /*, { maxAge: 900000, httpOnly: true }*/);	
	res.redirect('/profile');
};

function getCookie(serviceName, token) {
	return JSON.stringify({ 
		'service': serviceName,
		'value': token
	});
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

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.contentType('application/json');
  res.json(content);
};
