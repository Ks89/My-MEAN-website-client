var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var thirdpartyConfig = require('./3dpartyconfig');

function updateUser (user, accessToken, profile) {
    user.google.id = profile.id;
    user.google.token = accessToken;
    user.google.name  = profile.displayName;
    user.google.email = profile.emails[0].value; //get the first email
    return user;
}

module.exports = function(passport) {
	passport.use(new GoogleStrategy({
	    clientID: thirdpartyConfig.google.clientID,
	    clientSecret: thirdpartyConfig.google.clientSecret,
		callbackURL: thirdpartyConfig.google.callbackURL
	},
	function(accessToken, refreshToken, profile, done) {
		console.log("Google callback called");
	    process.nextTick(function () {
	      	console.log(profile);

	      	User.findOne({ 'google.id': profile.id }, function (err, user) {
	        	console.log("User.findOne...");
	        	if (err) { return done(err); }

	          	if (user) { // if the user is found, then log them in
		            console.log("User found");
		            // if there is a user id already but no token (user was linked at one point and then removed)
		            // just add our token and profile information
		            if (!user.google.token) {
		              var user = updateUser(user, accessToken, profile);
		              user.save(function(err) {
		                if (err) { throw err; }
		                return done(null, user);
		              });
		            }
		            return done(null, user); // user found, return that user
		        } else { //otherwise, if there is no user found with that github id, create them
		            var user = updateUser(new User(), accessToken, profile);
		            console.log("New user created: " + user);
		            user.save(function(err) {
		              if (err) { throw err; }
		              return done(null, user);
		            });
		        }
	        });
	  	});
	}));
}