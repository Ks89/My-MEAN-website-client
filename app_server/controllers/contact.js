var stubTransport = require('nodemailer-stub-transport');
var nodemailer = require('nodemailer');
var url = require('url');
var request = require('request');
var logger = require('../utils/logger.js');


//TODO refactor this code!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

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

function send(formEmail, callback) {
	console.log('Sending an email from ' + process.env.USER_EMAIL + ' to: ' + formEmail.email);
	var result = 1; //never remove to prevent "return undefined"
	if (formEmail) {
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
				result = 404;
				callback(result);
			}
			console.log('OK -----> returning 200');
			result = 200;
			callback(result);
		});
	} else {
		console.log('Error ----> returning 404');
		result = 404;
		callback(result);
	}
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

	request.post({url:'https://www.google.com/recaptcha/api/siteverify', form: data}, 
		(err,response,body) => {

			if (err) {
				console.error('Failed:', err);
				res.status(404);
				res.send("Error 404");
			}

			var result = JSON.parse( body );
			console.log(result);

			if(!result.success) {
				res.status(404).send(result['error-codes']);
			} else {
				console.log("Trying to send an email");
				if (req && req.body.emailFormData) {
					console.log("Preparing to send an email");
					
					var callback = function(resultVal) {
						console.log("callaback called with resultVal: " + resultVal);
						if(resultVal == 200) {
							console.log('Message sent successfully from: ' + req.body.emailFormData.email);
							res.status(200);
							res.send('Message sent successfully from: ' + req.body.emailFormData.email);
						} else {
							console.log("Error, resultVal!=200 -> " + resultVal);	
							res.status(404);
							res.send("Error 404");
						}
					};

					//send the email using the callback defined above and the emailFormData obtained from the
					//req.body. I'm accessing to emailFormData, because I build the data in contactData
					send(req.body.emailFormData, callback);
				}
			}
		}
	);
};