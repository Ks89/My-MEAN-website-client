//cused into the main app.js
module.exports = function (userRef, passportRef) {
  var LocalStrategy = require('passport-local').Strategy;

  passportRef.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    userRef.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username.'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      return done(null, user);
    });
  }));

  return module;
}