var stubTransport = require('nodemailer-stub-transport');
var nodemailer = require('nodemailer');
var url = require('url');
var request = require('request');
var logger = require('../utils/logger.js');
var Utils = require('../utils/util');
var async = require('async');


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

/* POST to send an email */
/* /api/email */
module.exports.sendEmailWithRecaptcha = function(req, res) {
	console.log("verifyCaptcha api called in app-api controllers " +req.body.response);

	//complete the request with my secret key
	//as described in google documentation.
	var data = {
		secret: process.env.RECAPTCHA_SECRET,
		response: req.body.response
		//here I can add also the IP, but it's not mandatory
	};

	const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify';

	async.waterfall([
    done => {
    	request.post({url:RECAPTCHA_URL, form: data}, (err,response,body) => {
    		console.log(body);
    		done(err, body);
    	});
    },
    (body, done) => {

	    var result = JSON.parse( body );
			console.log(result);
			if(result.success === false) {
				if(result['error-codes']) {
					Utils.sendJSONres(res, 401, result['error-codes']);
				} else {
					Utils.sendJSONres(res, 401, "Recaptcha verify answered FALSE!");
				}
			} else {
				done();
			}
		},
		(done) => {

			console.log("Trying to send an email");
			if (req.body.emailFormData && req.body.emailFormData.email &&
				req.body.emailFormData.object && req.body.emailFormData.messageText) {

				console.log("Preparing to send an email");
				done(null, req.body.emailFormData);
			} else {
				Utils.sendJSONres(res, 400, 'Missing input params');
			}
		},
		(formEmail, done) => {

			console.log('Sending an email from ' + process.env.USER_EMAIL + ' to: ' + formEmail.email);

			var message = {
				from: process.env.USER_EMAIL,
				to: formEmail.email,
				subject: formEmail.object,
				html: formEmail.messageText,
				generateTextFromHtml: true
			};

			mailTransport.sendMail(message, err => {
				if (err) {
					console.log('err ----> returning 404');
					console.log(err.message);
					done(err, 404, null);
				}
				console.log('OK -----> returning 200');
				done(null, 200, formEmail);
			});
		},
		(resultHttpCode, formEmail, done) => {

			console.log("resultHttpCode: " + resultHttpCode);
			if(resultHttpCode === 200) {
				console.log('Message sent successfully to: ' + formEmail.email);
				Utils.sendJSONres(res, 200, { message: formEmail.email });
			} else {
				console.log("Error, resultHttpCode!=200 -> " + resultHttpCode);
				Utils.sendJSONres(res, 500, "Impossibile to send the email");
			}
	  }], (err) => {
	    if (err) {
	    	Utils.sendJSONres(res, 500, "Unknown error");
			}
    });
};
