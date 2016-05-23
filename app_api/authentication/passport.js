//used into the main app.js
module.exports = function (passportRef) {
  var mongoose = require('mongoose');
  var User = mongoose.model('User');
  var logger = require('../utils/logger.js');
  
  //set this to serialize and deserialize informations like the user
  passportRef.serializeUser(function(user, done) {
    logger.silly("Serializing user " + user);
    done(null, user.id);
  });

  passportRef.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      logger.silly("Deserializing user " + user);
      done(err, user);
    });
  });

  //-------------------------set the strategies----------------------
  //local
  require('./local/local-passport')(User, passportRef);

  //third parties, like fb, github, google and so on
  require('./3dparty/3dparty-passport')(User, passportRef);

  //other strategies still broken
  require('./3dparty/twitter-passport')(User, passportRef);
  require('./3dparty/linkedin-passport')(User, passportRef);


  return module;
};