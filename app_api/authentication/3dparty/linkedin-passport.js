module.exports = function (userRef, passportRef) {
  var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
  var thirdpartyConfig = require('./3dpartyconfig');
  var logger = require('../../utils/logger.js');

  function updateUser (user, accessToken, profile) {
    user.linkedin.id = profile.id;
    user.linkedin.token = accessToken;
    user.linkedin.name  = profile.name;
    user.linkedin.email = profile.emails[0].value; //get the first email
    user.linkedin.profileUrl = profile.profileUrl;
    return user;
  }
  
  passportRef.use(new LinkedInStrategy( thirdpartyConfig.linkedin, 
  function(req, accessToken, refreshToken, profile, done) {

    logger.debug('Linkedin authentication called');
    
    process.nextTick(function () {
      console.log(profile);

      //check if the user is already logged in using the local authentication
      var sessionLocalUserId = req.session.localUserId;
      if(sessionLocalUserId) {
        //the user is already logged in
        userRef.findOne({ '_id': sessionLocalUserId }, function (err, user) {
          if (err) { throw err; }
          var userUpdated = updateUser(user, accessToken, profile);
          console.log("updated localuser with 3dpartyauth");
          userUpdated.save(function(err) {
            if (err) { throw err; }
            return done(null, userUpdated);
          });
        });
      } else {
      if (!req.user) { //if the user is NOT already logged in    
        userRef.findOne({ 'linkein.id': profile.id }, function (err, user) {
          console.log("User.findOne...");
          if (err) { return done(err); }

          if (user) { // if the user is found, then log them in
            console.log("User found");
            // if there is a user id already but no token (user was linked at one point and then removed)
            // just add our token and profile information
            if (!user.linkein.token) {
              var user = updateUser(user, accessToken, profile);
              user.save(function(err) {
                if (err) { throw err; }
                return done(null, user);
              });
            }
            return done(null, user); // user found, return that user
          } else { //otherwise, if there is no user found with that id, create them
            var newUser = updateUser(new userRef(), accessToken, profile);
            console.log("New user created: " + newUser);
            newUser.save(function(err) {
              if (err) { throw err; }
              return done(null, newUser);
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
    }
    }); //end of process.nextTick
  } //end of function(...)
  ));//end of passport.use

  return module;
}