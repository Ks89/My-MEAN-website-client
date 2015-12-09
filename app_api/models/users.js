var mongoose = require( 'mongoose' );
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
  local: {
    email: String,
    name: String,
    hash: String //hash contains the passqord with also the salt generated with bcrypt
  },
  //other type os users based on the login's type
  facebook : {
    id : String,
    token : String,
    email : String,
    name : String,
    profileUrl: String
  },
  twitter : {
    id : String,
    token : String,
    displayName : String,
    username : String
  },
  google : {
    id : String,
    token : String,
    email : String,
    name : String
  },
  github : {
    id : String,
    token : String,
    email : String,
    displayName : String,
    username: String,
    profileUrl: String
  }

});

userSchema.methods.setPassword = function(password) {
  //set password hashed with the salt integrated
  //like explained on stackoverflow:
  // The salt is incorporated into the hash (encoded in a base64-style format).
  this.local.hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.hash);
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this.local._id,
    email: this.local.email,
    name: this.local.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, process.env.JWT_SECRET); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

mongoose.model('User', userSchema);