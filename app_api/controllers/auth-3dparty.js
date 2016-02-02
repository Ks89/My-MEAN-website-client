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

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.contentType('application/json');
  res.json(content);
};

/* GET a user by token */
/* /api/users/:token */
module.exports.usersReadOneByToken = function(req, res) {
	console.log('Finding a User', req.params);
	if (req.params && req.params.token) {
		User.findOne({ 'github.token' : req.params.token }, function(err, user) {
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


//----- functions used to manage the object "user" returned --------

module.exports.callbackRedirectFacebook = function(req, res) { 
	console.log("callbackRedirectFacebook called");
	console.log(req.user.facebook); //the entire object
	//only the object putted with passport.serializeUser(function(user, done) {
	console.log('Session ->'); 
	console.log(req.session);
	res.cookie("usertoken", req.user.facebook.token+''/*, { maxAge: 900000, httpOnly: true }*/);
	res.redirect('/profile');
};
module.exports.callbackRedirectGoogle = function(req, res) { 
	console.log("callbackRedirectGoogle called");
	console.log('Session ->'); 
	console.log(req.session);
	res.cookie("usertoken", req.user.google.token+''/*, { maxAge: 900000, httpOnly: true }*/);
	res.redirect('/profile');
};
module.exports.callbackRedirectGithub = function(req, res) { 
	console.log("callbackRedirectGithub called");
	console.log('Session ->'); 
	console.log(req.session);
	res.cookie('usertoken', req.user.github.token+''/*, { maxAge: 900000, httpOnly: true }*/);
	res.redirect('/profile');
};
module.exports.callbackRedirectTwitter = function(req, res) { 
	console.log("callbackRedirectTwitter called");
	console.log('Session ->'); 
	console.log(req.session);
	res.cookie("usertoken", req.user.twitter.token+''/*, { maxAge: 900000, httpOnly: true }*/);
	res.redirect('/profile');
};

