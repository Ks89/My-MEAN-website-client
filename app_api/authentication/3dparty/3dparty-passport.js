module.exports = function (userRef, passportRef) {
  var thirdpartyConfig = require('./3dpartyconfig');
  var FacebookStrategy = require('passport-facebook').Strategy;
  var GitHubStrategy = require('passport-github2').Strategy;
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var logger = require('../../utils/logger.js');

  //----------experimental---
  var authExperimentalFeatures = require('../../controllers/auth-experimental-collapse-db.js');
  //-------------------------

  function updateUser (user, accessToken, profile, serviceName) {
    switch(serviceName) {
      case 'facebook':
        user[serviceName].id = profile.id;
        user[serviceName].token = accessToken;
        user[serviceName].name  = profile.name.givenName + ' ' + profile.name.familyName;
        user[serviceName].email = profile.emails[0].value; //get the first email
        user[serviceName].profileUrl = profile.profileUrl;
        return user;
      case 'github':
        user[serviceName].id = profile.id;
        user[serviceName].token = accessToken;
        user[serviceName].name  = profile.displayName;
        user[serviceName].email = profile.emails[0].value; //get the first email
        user[serviceName].username = profile.username;
        user[serviceName].profileUrl = profile.profileUrl;
        return user;
      case 'google':
        user[serviceName].id = profile.id;
        user[serviceName].token = accessToken;
        user[serviceName].name  = profile.displayName;
        user[serviceName].email = profile.emails[0].value; //get the first email
        return user;
    }    
    return user;
  }

  function authenticate(req, accessToken, refreshToken, profile, done, serviceName) {

    logger.debug(serviceName + ' authentication called');

    process.nextTick(function () {
        //check if the user is already logged in using the local authentication
        var sessionLocalUserId = req.session.localUserId;
        if(sessionLocalUserId) {
          //the user is already logged in
          userRef.findOne({ '_id': sessionLocalUserId }, function (err, user) {
            if (err) { throw err; }
            var userUpdated = updateUser(user, accessToken, profile, serviceName);
            console.log("updated localuser with 3dpartyauth");
            userUpdated.save(function(err) {
              if (err) { throw err; }

              //----------------- experimental ---------------
              authExperimentalFeatures.collapseDb(user, serviceName);
              //----------------------------------------------
              
              return done(null, userUpdated);
            });
          });
        } else {
        if (!req.user) { //if the user is NOT already logged in
          const serviceNameId = serviceName + '.id';    
          userRef.findOne({ serviceNameId: profile.id }, function (err, user) {
            console.log("User.findOne...");
            if (err) { return done(err); }

            if (user) { // if the user is found, then log them in
              console.log("User found");
              // if there is a user id already but no token (user was linked at one point and then removed)
              // just add our token and profile information
              var userUpdated = '';
              if (!user[serviceName].token) {
                userUpdated = updateUser(user, accessToken, profile, serviceName);
                userUpdated.save(function(err) {
                  if (err) { throw err; }
                  return done(null, userUpdated);
                });
              }
              return done(null, user); // user found, return that user
            } else { //otherwise, if there is no user found with that id, create them
              var newUser = updateUser(new userRef(), accessToken, profile, serviceName);
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
          var user = updateUser(req.user, accessToken, profile, serviceName);        
          user.save(function(err) {
            if (err) { throw err; }

              //----------------- experimental ---------------
              authExperimentalFeatures.collapseDb(user, serviceName);
              //----------------------------------------------


              return done(null, user);
            });
        }
      }
    });
  }

  
  function facebookAuthenticate(serviceName) {
   return new FacebookStrategy( thirdpartyConfig.facebook,
    function(req, accessToken, refreshToken, profile, done) {
      authenticate(req, accessToken, refreshToken, profile, done, serviceName);        
    });
  }
  function githubAuthenticate(serviceName) {
   return new GitHubStrategy( thirdpartyConfig.github,
    function(req, accessToken, refreshToken, profile, done) {
      authenticate(req, accessToken, refreshToken, profile, done, serviceName);        
    });
  }
  function googleAuthenticate(serviceName) {
   return new GoogleStrategy( thirdpartyConfig.google,
    function(req, accessToken, refreshToken, profile, done) {
      authenticate(req, accessToken, refreshToken, profile, done, serviceName);        
    });
  }

  passportRef.use(facebookAuthenticate('facebook'));
  passportRef.use(githubAuthenticate('github'));
  passportRef.use(googleAuthenticate('google'));

  return module;
};