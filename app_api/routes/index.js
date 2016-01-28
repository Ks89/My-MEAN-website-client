var express = require('express');
var app = express();
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});


var ctrlAuthLocal = require('../controllers/auth-local');
var ctrlAuth3dParty = require('../controllers/auth-3dparty');
var ctrlProjects = require('../controllers/projects');
var ctrlContact = require('../controllers/contact');
//var ctrlAuthors = require('../controllers/authors');


//--------------------------------normal routes-----------------------------------
// projects
router.get('/projects', ctrlProjects.projectsList);
router.get('/projecthome', ctrlProjects.projectsListHomepage);
router.post('/projects', ctrlProjects.projectsCreate);
router.get('/projects/:projectid', ctrlProjects.projectsReadOne);
router.put('/projects/:projectid', ctrlProjects.projectsUpdateOne);
router.delete('/projects/:projectid', ctrlProjects.projectsDeleteOne);

router.post('/email', ctrlContact.sendEmailWithRecaptcha);


// var request = require('request');
//router.get('/authentication/github', function(req, res) {
//	 console.log("authentication " +req);
	//complete the request with my secret key
	//as described in google documentation.
	// var data = {
	// 	secret: process.env.RECAPTCHA_SECRET,
	// 	response: req.body.response
	// 	//here I can add also the IP, but it's not mandatory
	// }
//	request('http://localhost:3000/api/auth/github', function (error, response, body) {
	  //if (!error && response.statusCode == 200) {
	    //console.log(body) // Print the google web page.
	    //res.status(200).send(response);
	  //   console.log("api called");
	  //   	if (!error && response.statusCode == 200) {
	  //   		console.log("api called in the if");
			// }
	  //}
//	});
	//res.redirect('/auth/github');
//	});


//------------------------------authenticate (first login)---------------------------------
// local authentication
router.post('/register', ctrlAuthLocal.register);
router.post('/login', ctrlAuthLocal.login);


//third party get user from db
router.get('/users/:token', ctrlAuth3dParty.usersReadOneByToken)

// third party anthentication
router.get('/auth/github', ctrlAuth3dParty.authGithub);
router.get('/auth/github/callback', ctrlAuth3dParty.authGithubCallback, ctrlAuth3dParty.callbackRedirectGithub);

router.get('/auth/google', ctrlAuth3dParty.authGoogle);
router.get('/auth/google/callback', ctrlAuth3dParty.authGoogleCallback, ctrlAuth3dParty.callbackRedirectGoogle);

router.get('/auth/facebook', ctrlAuth3dParty.authFacebook);
router.get('/auth/facebook/callback', ctrlAuth3dParty.authFacebookCallback, ctrlAuth3dParty.callbackRedirectFacebook);

router.get('/auth/twitter', ctrlAuth3dParty.authTwitter);
router.get('/auth/twitter/callback', ctrlAuth3dParty.authTwitterCallback, ctrlAuth3dParty.callbackRedirectTwitter);

//-------------------authorize (already logged in/connecting other social account)-------------------
// local authentication

router.get('/connect/github', ctrlAuth3dParty.connectGithub);
router.get('/connect/github/callback', ctrlAuth3dParty.connectGithubCallback);

router.get('/connect/google', ctrlAuth3dParty.connectGoogle);
router.get('/connect/google/callback', ctrlAuth3dParty.connectGoogleCallback);

router.get('/connect/facebook', ctrlAuth3dParty.connectFacebook);
router.get('/connect/facebook/callback', ctrlAuth3dParty.connectFacebookCallback);

router.get('/connect/twitter', ctrlAuth3dParty.connectTwitter);
router.get('/connect/twitter/callback', ctrlAuth3dParty.connectTwitterCallback);

//add the unlinks

module.exports = router;