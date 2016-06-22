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
    	if(process.env.NODE_ENV !== 'test') {
	    	request.post({url:RECAPTCHA_URL, form: data}, (err,response,body) => {
	    		console.log('KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK');
	    		console.log(body);
	    		done(err, body);
	    	});
	    } else {
	    	console.log("I'm testing this method");
	    	//TODO add something to be able to test this method.
	    	//for example done(null, {
			//						  "success": true,
			//						  "challenge_ts": "2016-06-22T22:59:40Z",
			//						  "hostname": "localhost"
			//						 } );
			done(null, JSON.stringify({
					  success: true,
					  challenge_ts: "2016-06-22T22:59:40Z",
					  hostname: "localhost"
					 }) );
	    }
    }, 
    (body, done) => {

    	var result = JSON.parse( body );
		console.log(result);
		if(!result.success) {
			Utils.sendJSONres(res, 404, result['error-codes']);
		} else {
			done();
		}
	},
	(done) => {

		console.log("Trying to send an email");
		if (req && req.body.emailFormData) {
			console.log("Preparing to send an email");
			done(null, req.body.emailFormData);
		}
	},
	(formEmail, done) => {

		if (formEmail) {
			console.log('Sending an email from ' + process.env.USER_EMAIL + ' to: ' + formEmail.email);
		
			var message = {
				from: process.env.USER_EMAIL, 
				to: formEmail.email,
				subject: formEmail.object,
				html: formEmail.messageText, 
				generateTextFromHtml: true
			};

			//this is an async call. You shouldn't use a "return" here.
			//I'm using a callback function
			mailTransport.sendMail(message, error => {
				if (error) {
					console.log('Error ----> returning 404');
					console.log(error.message);
					done(null, 404, formEmail);
				}
				console.log('OK -----> returning 200');
				done(null, 200, formEmail);
			});
		} else {
			console.log('Error ----> returning 404');
			done(null, 404, formEmail);
		}
	},
	(resultVal, formEmail, done) => {

		console.log("callaback called with resultVal: " + resultVal);
		if(resultVal === 200) {
			console.log('Message sent successfully from: ' + formEmail.email);
			Utils.sendJSONres(res, 200, formEmail.email);
		} else {
			console.log("Error, resultVal!=200 -> " + resultVal);	
			Utils.sendJSONres(res, 500, "Impossibile to send the email");
		}

    }], (err, user) => {
    	if (err) {
    		Utils.sendJSONres(res, 500, "Unknown error");
		}
    });
};