//cused into the main app.js
module.exports = function (passportRef) {
  var mongoose = require('mongoose');
  var User = mongoose.model('User');

  //set this to serialize and deserialize informations like the user
  passportRef.serializeUser(function(user, done) {
    console.log("Serializing user " + user);
    done(null, user.id);
  });

  passportRef.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log("Deserializing user " + user);
      done(err, user);
    });
  });

  //finally set the strategies
  //local
  require('./local/local-passport')(User, passportRef);
  //third-party
  require('./3dparty/facebook-passport')(User, passportRef);
  require('./3dparty/google-passport')(User, passportRef);
  require('./3dparty/github-passport')(User, passportRef);
  require('./3dparty/twitter-passport')(User, passportRef);

  return module;
};