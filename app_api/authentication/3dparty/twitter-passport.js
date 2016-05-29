module.exports = function (userRef, passportRef) {
	var TwitterStrategy = require('passport-twitter').Strategy;
	var thirdpartyConfig = require('./3dpartyconfig');
	var logger = require('../../utils/logger.js');

	function updateUser (user, accessToken, profile) {
		user.twitter.id = profile.id;
		user.twitter.token = accessToken;
		user.twitter.name  = profile.displayName;
		user.twitter.email = profile.emails[0].value; //get the first email
		return user;
	}

	passportRef.use(new TwitterStrategy( thirdpartyConfig.twitter,
		function(req, token, tokenSecret, profile, cb) {
			console.log("called twitter strategy");
			
			console.log(profile);
			
			logger.debug('Twitter authentication called');

			//process.nextTick(function () {
				//userRef.findOne({ 'twitter.id': profile.id }, function (err, user) {
			return cb(null, profile);

				//});
			//});
		}));
	
	return module;
};