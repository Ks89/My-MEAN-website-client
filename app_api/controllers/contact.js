var nodemailer = require('nodemailer');
var url = require('url');

var mailTransport = nodemailer.createTransport({
	host: 'mail.stefanocappa.it',
	port: '25',
	debug: true, //this!!!
	auth: {
		user: process.env.USER_EMAIL, //secret data
		pass: process.env.PASS_EMAIL //secret data
	}
});


/* @POST */
module.exports.sendEmail = function(req, res) {
	console.log('Sending an email from ' + process.env.USER_EMAIL + ' to: ' + req.body.email);
	if (req && req.body) {
		var message = {
			from: process.env.USER_EMAIL, 
			to: req.body.email,
			subject: req.body.object,
			html: req.body.messageText, 
			generateTextFromHtml: true
		};
		mailTransport.sendMail(message, function(error) {
			if (error) {
				console.log('Error occured');
				console.log(error.message);
				res.status(404);
				res.send("Error 404");
				return;
			}
			console.log('Message sent successfully from: ' + req.body.email);
			res.status(200);
			res.send('Message sent successfully from: ' + req.body.email);
			return;
		});
	
	} else {
		res.status(404);
		res.send("Error 404");
	}
}