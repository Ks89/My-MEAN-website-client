var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var google = require('./google-passport');
var github = require('./github-passport');
var twitter = require('./twitter-passport');
var facebook = require('./facebook-passport');

var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.serializeUser(function(user, done) {
  //TODO i can change this specifying the desired data, 
  //like id, email an so on... 
  //Id is mandatory, because required to deserialize a user 
  //with User.findById -> id is the primary key ;)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email'
},
function(username, password, done) {
  User.findOne({ email: username }, function (err, user) {
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

facebook(passport);
google(passport);
github(passport);
twitter(passport);