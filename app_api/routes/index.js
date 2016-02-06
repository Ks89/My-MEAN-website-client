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
router.get('/projects/:projectid', ctrlProjects.projectsReadOne);

router.post('/email', ctrlContact.sendEmailWithRecaptcha);

//third party get user from db
router.get('/users/:service/:token', ctrlAuth3dParty.usersReadOneByToken)


//------------------------------authenticate (first login)---------------------------------
// local authentication
router.post('/register', ctrlAuthLocal.register);
router.post('/login', ctrlAuthLocal.login);

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
// third party authorization
router.get('/connect/github', ctrlAuth3dParty.connectGithub);
router.get('/connect/github/callback', ctrlAuth3dParty.connectGithubCallback);

router.get('/connect/google', ctrlAuth3dParty.connectGoogle);
router.get('/connect/google/callback', ctrlAuth3dParty.connectGoogleCallback);

router.get('/connect/facebook', ctrlAuth3dParty.connectFacebook);
router.get('/connect/facebook/callback', ctrlAuth3dParty.connectFacebookCallback);

router.get('/connect/twitter', ctrlAuth3dParty.connectTwitter);
router.get('/connect/twitter/callback', ctrlAuth3dParty.connectTwitterCallback);

//add the unlinks
// facebook -------------------------------
router.get('/unlink/facebook', ctrlAuth3dParty.unlinkFacebook);
router.get('/unlink/github', ctrlAuth3dParty.unlinkGithub);
router.get('/unlink/google', ctrlAuth3dParty.unlinkGoogle);
router.get('/unlink/twitter', ctrlAuth3dParty.unlinkTwitter);


module.exports = router;