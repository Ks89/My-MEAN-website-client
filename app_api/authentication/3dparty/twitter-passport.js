module.exports = function (userRef, passportRef) {

	var TwitterStrategy = require('passport-twitter').Strategy;
	var thirdpartyConfig = require('./3dpartyconfig');

	function updateUser (user, accessToken, profile) {
		user.twitter.id = profile.id;
		user.twitter.token = accessToken;
		user.twitter.name  = profile.displayName;
		user.twitter.email = profile.emails[0].value; //get the first email
		return user;
	}

	passportRef.use(new TwitterStrategy({
		consumerKey: thirdpartyConfig.twitter.consumerKey,
		consumerSecret: thirdpartyConfig.twitter.consumerSecret,
		callbackURL: thirdpartyConfig.twitter.callbackURL,
		passReqToCallback : true
	},
	function(token, tokenSecret, profile, done) {
		console.log("---------->Twitter authentication called");
		process.nextTick(function () {
			console.log(profile);
			userRef.findOne({ 'twitter.id': profile.id }, function (err, user) {
				return done(err, user);
			});
		});
	}));
	
  	return module;
}