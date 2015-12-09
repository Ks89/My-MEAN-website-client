var passport = require('passport');

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


//----- functions used to manage the object "user" returned --------

module.exports.callbackRedirectFacebook = function(req, res) { 
	console.log("callbackRedirectFacebook called");
	console.log(req.user.facebook); //the entire object
	//only the object putted with passport.serializeUser(function(user, done) {
	console.log(req.session); 
	res.redirect('/profile'); 
};
module.exports.callbackRedirectGoogle = function(req, res) { 
	console.log("callbackRedirectGoogle called");
	console.log(req.user.google);
	console.log(req.session);
	res.redirect('/profile'); 
};
module.exports.callbackRedirectGithub = function(req, res) { 
	console.log("callbackRedirectGithub called");
	console.log(req.user.github);
	console.log(req.session);
	res.redirect('/profile'); 
};
module.exports.callbackRedirectTwitter = function(req, res) { 
	console.log("callbackRedirectTwitter called");
	console.log(req.user.twitter);
	console.log(req.session);
	res.redirect('/profile'); 
};

