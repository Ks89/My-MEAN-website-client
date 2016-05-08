var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../utils/logger.js');
var authCommon = require('./auth-common.js');
var Utils = require('../utils/util.js');
var utils = new Utils();
var async = require('async');
var crypto = require('crypto');

var nodemailer = require('nodemailer');
var url = require('url');
var request = require('request');
var logger = require('../utils/logger.js');

var mailTransport = nodemailer.createTransport({
  host: 'mail.stefanocappa.it',
  port: '25',
  debug: true, //this!!!
  auth: {
    user: process.env.USER_EMAIL, //secret data
    pass: process.env.PASS_EMAIL //secret data
  }
});

/* POST to register a local user */
/* /api/register */
module.exports.register = (req, res) => {
  console.log('called register server side');
  if(!req.body.name || !req.body.email || !req.body.password) {
    utils.sendJSONresponse(res, 400, "All fields required");
  }

  async.waterfall([ 
    done => {
      crypto.randomBytes(128, (err, buf) => {
        if (err) throw err;
        var token = buf.toString('hex');
        done(err, token);
      });
    }, (token, done) => {
      console.log("email in body: " + req.body.email);
      User.findOne({ 'local.email': req.body.email }, (err, user) => {
        if (err || user) {
          utils.sendJSONresponse(res, 400, "User already exists. Try to login.");
          return;
        } 

        var newUser = new User();
        newUser.local.name = req.body.name;
        newUser.local.email = req.body.email;
        newUser.setPassword(req.body.password);
        newUser.local.activateAccountToken = token;
        newUser.local.activateAccountExpires = Date.now() + 3600000; // 1 hour

        newUser.save((err, savedUser) => {
          if (err) {
            throw err;
          } else {
            console.log("USER: "); 
            console.log(savedUser);
            //const tokenJwt = savedUser.generateJwt(savedUser);

            // req.session.localUserId = savedUser._id;
            // req.session.authToken = authCommon.generateJwtCookie(savedUser);

            //utils.sendJSONresponse(res, 200, { token: tokenJwt });
          }
          done(err, token, savedUser);
        });
      });
    }, (token, user, done) => {
      var message = {
        from: process.env.USER_EMAIL, 
        to: req.body.email,
        subject: 'Node.js Registratin',
        html: 'You are receiving this because you (or someone else) have requested an account for this website.\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/activate/' + token + '\n\n' +
        'If you did not request this, please ignore this email.\n', 
        generateTextFromHtml: true
      };

      //this is an async call. You shouldn't use a "return" here.
      //I'm using a callback function
      mailTransport.sendMail(message, err => {
        done(err, 'done');
      });
    }
    ], err => {
      if (err) { 
        return next(err);
      } else {
        utils.sendJSONresponse(res, 200, "Ok");      
      }
    });
};

/* POST to login as local user */
/* /api/login */
module.exports.login = (req, res) => {
  if(!req.body.email || !req.body.password) {
    utils.sendJSONresponse(res, 400, {
      "message": "All fields required"
    });
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      utils.sendJSONresponse(res, 404, err);
    }
    if(user){

      console.log("USER: "); 
      console.log(user);

      if(!user.local.activateAccountToken && !user.local.activateAccountExpires) {
        const token = user.generateJwt(user);

        req.session.localUserId = user._id;

        req.session.authToken = authCommon.generateJwtCookie(user);
        
        utils.sendJSONresponse(res, 200, { token: token });
      } else {
        utils.sendJSONresponse(res, 400, "Incorrect username or password. Or this account is not activated, check your mailbox.");
      }
    } else {
      utils.sendJSONresponse(res, 401, info);
    }
  })(req, res);
};

/* GET to unlink the local account */
/* /api/unlink/local */
module.exports.unlinkLocal = (req, res) => {
  authCommon.unlinkServiceByName(req, 'local', res);
};

/* GET to reset the local password */
/* /api/reset */
module.exports.reset = (req, res) => {
  async.waterfall([
    done => {
      crypto.randomBytes(128, (err, buf) => {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      console.log("email in body: " + req.body.email);
      User.findOne({ 'local.email': req.body.email }, (err, user) => {
        if (!user) {
          utils.sendJSONresponse(res, 404, 'No account with that email address exists.');
          return;
        }

        user.local.name = user.local.name;
        user.local.email = user.local.email;
        user.local.hash = user.local.hash;
        user.local.resetPasswordToken = token;
        user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save((err, savedUser) => {
          done(err, token, savedUser);
        });
      });
    },
    (token, user, done) => {
      var message = {
        from: process.env.USER_EMAIL, 
        to: req.body.email,
        subject: 'Node.js Password Reset',
        html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n', 
        generateTextFromHtml: true
      };

      //this is an async call. You shouldn't use a "return" here.
      //I'm using a callback function
      mailTransport.sendMail(message, err => {
        done(err, 'done');
      });
    }
    ], err => {
      if (err) { 
        return next(err); 
      } else { 
        utils.sendJSONresponse(res, 200, 'An e-mail has been sent to ' + 'user.local.email' + ' with further instructions.');
      }
    });
};


module.exports.resetPasswordFromEmail = (req, res) => {
  console.log("resetPasswordFromEmail api - new pwd " + req.body.newPassword + ", emailToken: " + req.body.emailToken);
  async.waterfall([
    done => {
      User.findOne({ 'local.resetPasswordToken': req.body.emailToken ,
         'local.resetPasswordExpires': { $gt: Date.now() }}, (err, user) => {
      // User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          utils.sendJSONresponse(res, 404, 'No account with that token exists.');
          return;
        }

        console.log('user found on db: ');
        console.log(user);

        //var newUser = new User();
        user.local.name = user.local.name;
        user.local.email = user.local.email;
        user.setPassword(req.body.newPassword);
        user.local.resetPasswordToken = undefined;
        user.local.resetPasswordExpires = undefined;

        user.save((err, savedUser) => {
          done(err, savedUser);
        });
      });
    },
    (user, done) => {

      var message = {
        from: process.env.USER_EMAIL, 
        to: user.local.email,
        subject: 'Node.js Password Reset confirmation',
        html: 'This is a confirmation that the password for your account ' + user.local.email + ' has just been changed.\n', 
        generateTextFromHtml: true
      };

      //this is an async call. You shouldn't use a "return" here.
      //I'm using a callback function
      mailTransport.sendMail(message, err => {
        //utils.sendJSONresponse(res, 200, 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
        done(err, 'done');
      });

    }
    ], err => {
      if (err) { 
        return next(err);
      } else {
        utils.sendJSONresponse(res, 200, 'An e-mail has been sent to ' + '' + ' with further instructions.');
      }
       //utils.sendJSONresponse(res, 404, 'Error??');
     });
};

/* GET to activate the local account, using
the token received on user's mailbox */
/* /api/activate/:randomToken */
module.exports.activateAccount = (req, res) => {
  console.log('activateAccount', req.body.emailToken);
  async.waterfall([
    done => {
      User.findOne({ 'local.activateAccountToken': req.body.emailToken ,
         'local.activateAccountExpires': { $gt: Date.now() }}, (err, user) => {
      // User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          utils.sendJSONresponse(res, 404, 'No account with that token exists.');
          return;
        }

        console.log('user found on db: ');
        console.log(user);

        //var newUser = new User();
        user.local.name = user.local.name;
        user.local.email = user.local.email;
        user.local.hash = user.local.hash;
        user.local.activateAccountToken = undefined;
        user.local.activateAccountExpires = undefined;

        user.save((err, savedUser) => {
          done(err, savedUser);
        });
      });
    },
    (user, done) => {

      var message = {
        from: process.env.USER_EMAIL, 
        to: user.local.email,
        subject: 'Node.js account activation confirmation',
        html: 'This is a confirmation that your account ' + user.local.email + ' has just been activated.\n', 
        generateTextFromHtml: true
      };

      //this is an async call. You shouldn't use a "return" here.
      //I'm using a callback function
      mailTransport.sendMail(message, err => {
        done(err, 'done');
      });

    }], err => {
      if (err) return next(err);
      utils.sendJSONresponse(res, 200, 'An e-mail has been sent to ' + '' + ' with further instructions.');
       //utils.sendJSONresponse(res, 404, 'Error??');
     });
};