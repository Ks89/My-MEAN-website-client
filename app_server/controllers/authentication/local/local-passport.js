//cused into the main app.js
module.exports = function (userRef, passportRef) {
  var LocalStrategy = require('passport-local').Strategy;
  var logger = require('../../../utils/logger.js');
  
  passportRef.use(new LocalStrategy({
    usernameField: 'email',
    passwordField : 'password',
    passReqToCallback : true
  },(req, username, password, done) => {
    process.nextTick(() => {
      userRef.findOne({ 'local.email': username }, (err, user) => {
        if (err) { 
          return done(err); 
        }

        if (!user || !user.validPassword(password)) {
          return done(null, false, 'Incorrect username or password. Or this account is not activated, check your mailbox.');
        }

        return done(null, user);
      });
    });
  }));

  return module;
};