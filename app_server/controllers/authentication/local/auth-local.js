var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var logger = require('../../../utils/logger.js');
var authCommon = require('../common/auth-common.js');
var Utils = require('../../../utils/util.js');
var async = require('async');
var crypto = require('crypto');

var stubTransport = require('nodemailer-stub-transport');
var nodemailer = require('nodemailer');
var url = require('url');
var request = require('request');
var mailTransport;

if(process.env.NODE_ENV === 'test') {
  mailTransport = nodemailer.createTransport(stubTransport());
} else {
  mailTransport = nodemailer.createTransport({
    host: 'mail.stefanocappa.it',
    port: '25',
    debug: true, //this!!!
    auth: {
      user: process.env.USER_EMAIL, //secret data
      pass: process.env.PASS_EMAIL //secret data
    }
  });
}

function emailMsg(to, subject, htmlMessage) {
  return {
    from: process.env.USER_EMAIL,
    to: to,
    subject: subject,
    html: htmlMessage,
    generateTextFromHtml: true
  };
}

//function passed to async.waterfall's arrays to send an email
function sendEmail(user, message, done) {
  mailTransport.sendMail(message, err => {
    done(err, user);
  });
}

//function passed to async.waterfall's arrays to create a random token
function createRandomToken(done) {
  crypto.randomBytes(64, (err, buf) => {
    if (err) throw err;
    var token = buf.toString('hex');
    done(err, token);
  });
}

/* POST to register a local user */
/* /api/register */
module.exports.register = (req, res) => {
  console.log('called register server side');
  if(!req.body.name || !req.body.email || !req.body.password) {
    Utils.sendJSONres(res, 400, "All fields required");
    return;
  }

  async.waterfall([
    createRandomToken, //first function defined below
    (token, done) => {
      const encodedUserName = encodeURI(req.body.name);
      console.log('Encoded userName: ' + encodedUserName);
      const link = 'http://' + req.headers.host + '/#/activate/' + token + '/' + encodedUserName;
      User.findOne({ 'local.email': req.body.email }, (err, user) => {
        if (err) {
          console.log('Internal error');
          Utils.sendJSONres(res, 500, "Unknown error while registering...");
          return;
        }

        if (user) {
          console.log('User already exists');
          Utils.sendJSONres(res, 400, "User already exists. Try to login.");
          return;
        }

        var newUser = new User();
        newUser.local.name = req.body.name;
        newUser.local.email = req.body.email;
        newUser.setPassword(req.body.password);
        newUser.local.activateAccountToken = token;
        newUser.local.activateAccountExpires =  new Date(Date.now() + 24*3600*1000); // 1 hour

        newUser.save((err, savedUser) => {
          if (err) {
            throw err;
          }
          console.log("Registered user: " + savedUser);

          //create message data
          const msgText = 'You are receiving this because you (or someone else) have requested an account for this website.\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            link + '\n\n' +
            'If you did not request this, please ignore this email.\n';
          const message = emailMsg(req.body.email, 'Welcome to stefanocappa.it', msgText);

          done(err, savedUser, message);
        });
      });
    },
    sendEmail //function defined below
    ], (err, user) => {
      console.log(err);
      if (err) {
        return next(err);
      } else {
        Utils.sendJSONres(res, 200, {message: "User with email " + user.local.email + " registered."});
      }
    });
};

/* POST to login as local user */
/* /api/login */
module.exports.login = (req, res) => {
  if(!req.body.email || !req.body.password) {
    Utils.sendJSONres(res, 400, "All fields required");
    return;
  }

  passport.authenticate('local', (err, user, info) => {
    console.log("called login...");
    if (!user || err) {
      Utils.sendJSONres(res, 401, "Incorrect username or password. Or this account is not activated, check your mailbox.");
      return;
    }

    console.log("user exists");
    console.log("Registered user: " + user);

    if(!user.local.activateAccountToken && !user.local.activateAccountExpires) {
      console.log("user enabled");
      const token = user.generateJwt();

      req.session.localUserId = user._id;

      try {
        req.session.authToken = authCommon.generateSessionJwtToken(user);
        Utils.sendJSONres(res, 200, { token: token });
      } catch (e) {
        logger.error(e);
        Utils.sendJSONres(res, 500, 'Impossible to generateSessionJwtToken');
      }

    } else {
      console.log("user NOT enabled");
      Utils.sendJSONres(res, 401, "Incorrect username or password. Or this account is not activated, check your mailbox.");
    }
  })(req, res);
};

/* GET to unlink the local account */
/* /api/unlink/local */
module.exports.unlinkLocal = (req, res) => {
  authCommon.unlinkServiceByName(req, 'local', res);
};

/* POST to reset the local password */
/* /api/reset */
module.exports.reset = (req, res) => {
  if(!req.body.email) {
    Utils.sendJSONres(res, 400, "Email fields is required.");
    return;
  }

  async.waterfall([
    createRandomToken,
    (token, done) => {
      const link = 'http://' + req.headers.host + '/#/reset/' + token;
      User.findOne({ 'local.email': req.body.email }, (err, user) => {
        if (!user || err) {
          Utils.sendJSONres(res, 404, 'No account with that email address exists.');
          return;
        }

        user.local.resetPasswordToken = token;
        user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save((err, savedUser) => {

          //create email data
          const msgText = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            link + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n';
          const message = emailMsg(req.body.email, 'Password reset for stefanocappa.it', msgText);

          done(err, savedUser, message);
        });
      });
    },
    sendEmail //function defined below
    ], (err, user) => {
      if (err) { 
        console.log(err);
        return next(err);
      } else {
        Utils.sendJSONres(res, 200, {message: 'An e-mail has been sent to ' + user.local.email + ' with further instructions.'});
      }
    });
};

/* POST to reset the local password */
/* /api/resetNewPassword */
module.exports.resetPasswordFromEmail = (req, res) => {
  if(!req.body.newPassword || !req.body.emailToken) {
    Utils.sendJSONres(res, 400, "Password and emailToken fields are required.");
    return;
  }

  async.waterfall([
    done => {
      User.findOne({ 'local.resetPasswordToken': req.body.emailToken ,
         'local.resetPasswordExpires': { $gt: Date.now() }}, (err, user) => {
        if (!user || err) {
          Utils.sendJSONres(res, 404, 'No account with that token exists.');
          return;
        }
        console.log('Reset password called for user: ' + user);

        user.setPassword(req.body.newPassword);
        user.local.resetPasswordToken = undefined;
        user.local.resetPasswordExpires = undefined;

        user.save((err, savedUser) => {

          //create email data
          const msgText = 'This is a confirmation that the password for your account ' +
            user.local.email + ' has just been changed.\n';
          const message = emailMsg(savedUser.local.email, 'Password for stefanocappa.it updated', msgText);

          done(err, savedUser, message);
        });
      });
    },
    sendEmail //function defined below
    ], (err, user) => {
      if (err) {
        console.log(err);
        return next(err);
      } else {
        Utils.sendJSONres(res, 200, {message: 'An e-mail has been sent to ' + user.local.email + ' with further instructions.'});
      }
     });
};

/* POST to activate the local account, using
the token received on user's mailbox */
/* /api/activate */
module.exports.activateAccount = (req, res) => {
  if(!req.body.emailToken || !req.body.userName) {
    Utils.sendJSONres(res, 400, "EmailToken and userName fields are required.");
    return;
  }

  const decodedUserName = decodeURI(req.body.userName);
  console.log('Decoded userName: ' + decodedUserName);

  async.waterfall([
    done => {
      User.findOne({ 'local.activateAccountToken': req.body.emailToken , 'local.name' : decodedUserName},
         /*,'local.activateAccountExpires': { $gt: Date.now() }},*/ (err, user) => {
        if (!user || err) {
          Utils.sendJSONres(res, 404, 'No account with that token exists.');
          return;
        }

        console.log("user.activateAccountExpires: " + user.local.activateAccountExpires);
        console.log("Date.now(): " + new Date(Date.now()));

        if(user.local.activateAccountExpires < new Date(Date.now())) {
          Utils.sendJSONres(res, 404, 'Link exprired! Your account is removed. Please, create another account, also with the same email address.');
          return;
        }

        console.log('Activate account with user: ' + user);

        user.local.activateAccountToken = undefined;
        user.local.activateAccountExpires = undefined;

        user.save((err, savedUser) => {
          console.log('Activated account with savedUser: ' + savedUser);

          //create email data
          const msgText = 'This is a confirmation that your account ' + user.local.name +
                          'with email ' + user.local.email + ' has just been activated.\n';
          const message = emailMsg(savedUser.local.email, 'Account activated for stefanocappa.it', msgText);

          done(err, savedUser, message);
        });
      });
    },
    sendEmail //function defined below
    ], (err, user) => {
      console.log('Finished');
      if (err) {
        console.log(err);
        return next(err);
      } else {
        Utils.sendJSONres(res, 200, {message: 'An e-mail has been sent to ' + user.local.email + ' with further instructions.'});
      }
     });
};
