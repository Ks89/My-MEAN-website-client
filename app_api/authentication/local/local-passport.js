//cused into the main app.js
module.exports = function (userRef, passportRef) {
  var LocalStrategy = require('passport-local').Strategy;

  passportRef.use(new LocalStrategy({
    usernameField: 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    process.nextTick(function() {
      userRef.findOne({ email: email }, function (err, user) {
        if (err) { 
          return done(err); 
        }
        if (user) {
          return done(null, false, 'Email already taken!');
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new userRef();

          // set the user's local credentials
          newUser.local.email    = email;
          newUser.local.password = newUser.setPassword(password);

          // save the user
          newUser.save(function(err) {
              if (err)
                  throw err;
              return done(null, newUser);
          });
        }



        // if (!user) {
        //   return done(null, false, {
        //     message: 'Incorrect username.'
        //   });
        // }
        // if (!user.validPassword(password)) {
        //   return done(null, false, {
        //     message: 'Incorrect password.'
        //   });
        // }
        // return done(null, user);
      });
    });
  }));

  return module;
}