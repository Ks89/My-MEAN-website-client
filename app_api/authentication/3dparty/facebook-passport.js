module.exports = function (userRef, passportRef) {
  var FacebookStrategy = require('passport-facebook').Strategy;
  var thirdpartyConfig = require('./3dpartyconfig');
  var logger = require('../../utils/logger.js');

  //----------experimental---
  var authExperimentalFeatures = require('../../controllers/auth-experimental-collapse-db.js');
  //-------------------------

  function updateUser (user, accessToken, profile) {
    user.facebook.id = profile.id;
    user.facebook.token = accessToken;
    user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
    user.facebook.email = profile.emails[0].value; //get the first email
    user.facebook.profileUrl = profile.profileUrl;
    return user;
  }

  passportRef.use(new FacebookStrategy( thirdpartyConfig.facebook,
  function(req, accessToken, refreshToken, profile, done) {
    
    logger.debug('Facebook authentication called');

    process.nextTick(function () {
      //console.log(profile);

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

            //----------------- experimental ---------------
            authExperimentalFeatures.collapseDb(user, "facebook");
            //----------------------------------------------
            
            return done(null, userUpdated);
          });
        });
      } else {
      if (!req.user) { //if the user is NOT already logged in    
        userRef.findOne({ 'facebook.id': profile.id }, function (err, user) {
          console.log("User.findOne...");
          if (err) { return done(err); }

          if (user) { // if the user is found, then log them in
            console.log("User found");
            // if there is a user id already but no token (user was linked at one point and then removed)
            // just add our token and profile information
            var userUpdated = '';
            if (!user.facebook.token) {
              userUpdated = updateUser(user, accessToken, profile);
              userUpdated.save(function(err) {
                if (err) { throw err; }
                return done(null, userUpdated);
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

            //----------------- experimental ---------------
            authExperimentalFeatures.collapseDb(user, "facebook");
            //----------------------------------------------


          return done(null, user);
        });
      }
    }
    }); //end of process.nextTick
  } //end of function(...)
  ));//end of passport.use

  return module;
};