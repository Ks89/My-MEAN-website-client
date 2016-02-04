module.exports = function (userRef, passportRef) {
  var FacebookStrategy = require('passport-facebook').Strategy;
  var thirdpartyConfig = require('./3dpartyconfig');

  function updateUser (user, accessToken, profile) {
    user.facebook.id = profile.id;
    user.facebook.token = accessToken;
    user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
    user.facebook.email = profile.emails[0].value; //get the first email
    user.facebook.profileUrl = profile.profileUrl;
    return user;
  }

  passportRef.use(new FacebookStrategy({
    clientID: thirdpartyConfig.facebook.clientID,
    clientSecret: thirdpartyConfig.facebook.clientSecret,
    callbackURL: thirdpartyConfig.facebook.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    console.log("Facebook callback called");

    process.nextTick(function () {
      console.log(profile);
      if (!req.user) { //check if the user is already logged in    
        userRef.findOne({ 'facebook.id': profile.id }, function (err, user) {
          console.log("User.findOne...");
          if (err) { return done(err); }

          if (user) { // if the user is found, then log them in
            console.log("User found");
            // if there is a user id already but no token (user was linked at one point and then removed)
            // just add our token and profile information
            if (!user.facebook.token) {
              var user = updateUser(user, accessToken, profile);
              user.save(function(err) {
                if (err) { throw err; }
                return done(null, user);
              });
            }
            return done(null, user); // user found, return that user
          } else { //otherwise, if there is no user found with that id, create them
            var user = updateUser(new userRef(), accessToken, profile);
            console.log("New user created: " + user);
            user.save(function(err) {
              if (err) { throw err; }
              return done(null, user);
            });
          }
        });
      } else { // user already exists and is logged in, we have to link accounts    
        // req.user pull the user out of the session
        // and finally update the user with the currecnt users credentials
        var user = updateUser(req.user, accessToken, profile);
        user.save(function(err) {
          if (err) { throw err; }
          return done(null, user);
        });
      }
    }); //end of process.nextTick
  } //end of function(...)
  ));//end of passport.use

  return module;
}