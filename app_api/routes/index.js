var express = require('express');
var app = express();
var router = express.Router();
var jwt = require('jsonwebtoken');

var logger = require('../utils/logger.js');
var Utils = require('../utils/util.js');
var utils = new Utils();

var restAuthMiddleware = require('./rest-auth-middleware');

var ctrlAuthLocal = require('../controllers/auth-local');
var ctrlAuth3dParty = require('../controllers/auth-3dparty');
var ctrlProjects = require('../controllers/projects');
var ctrlContact = require('../controllers/contact');
var ctrlUser = require('../controllers/users');

//--------------------------------normal routes-----------------------------------
// projects
router.get('/projects', ctrlProjects.projectsList);
router.get('/projecthome', ctrlProjects.projectsListHomepage);
router.get('/projects/:projectid', ctrlProjects.projectsReadOne);

//contacts
router.post('/email', ctrlContact.sendEmailWithRecaptcha);

//users for authentication
router.get('/users/:id', ctrlUser.usersReadOneById)

//local authentication
router.post('/register', ctrlAuthLocal.register);
router.post('/login', ctrlAuthLocal.login);

//TODO move to a general place, and not into authlocal
router.get('/decodeToken/:token', ctrlAuthLocal.decodeToken); 

//------------------------------authenticate (first login)---------------------------------
router.get('/auth/github', ctrlAuth3dParty.authGithub);
router.get('/auth/github/callback', ctrlAuth3dParty.authGithubCallback, ctrlAuth3dParty.callbackRedirectGithub);
router.get('/auth/google', ctrlAuth3dParty.authGoogle);
router.get('/auth/google/callback', ctrlAuth3dParty.authGoogleCallback, ctrlAuth3dParty.callbackRedirectGoogle);
router.get('/auth/facebook', ctrlAuth3dParty.authFacebook);
router.get('/auth/facebook/callback', ctrlAuth3dParty.authFacebookCallback, ctrlAuth3dParty.callbackRedirectFacebook);
router.get('/auth/twitter', ctrlAuth3dParty.authTwitter);
router.get('/auth/twitter/callback', ctrlAuth3dParty.authTwitterCallback, ctrlAuth3dParty.callbackRedirectTwitter);
router.get('/auth/linkedin', ctrlAuth3dParty.authLinkedin);
router.get('/auth/linkedin/callback', ctrlAuth3dParty.authLinkedinCallback, ctrlAuth3dParty.callbackRedirectLinkedin);

//-------------------authorize (already logged in/connecting other social account)-------------------
router.get('/connect/github', ctrlAuth3dParty.connectGithub);
router.get('/connect/github/callback', ctrlAuth3dParty.connectGithubCallback);
router.get('/connect/google', ctrlAuth3dParty.connectGoogle);
router.get('/connect/google/callback', ctrlAuth3dParty.connectGoogleCallback);
router.get('/connect/facebook', ctrlAuth3dParty.connectFacebook);
router.get('/connect/facebook/callback', ctrlAuth3dParty.connectFacebookCallback);
router.get('/connect/twitter', ctrlAuth3dParty.connectTwitter);
router.get('/connect/twitter/callback', ctrlAuth3dParty.connectTwitterCallback);
router.get('/connect/linkedin', ctrlAuth3dParty.connectLinkedin);
router.get('/connect/linkedin/callback', ctrlAuth3dParty.connectLinkedinCallback);


// ----------------------------------------------------------------
// route middleware to authenticate and check token
// all routes defined below will be protected by the following code
// ----------------------------------------------------------------
router.use(restAuthMiddleware.restAuthenticationMiddleware);


//-------------------unlink routes-------------------
router.get('/unlink/local/:id', ctrlAuthLocal.unlinkLocal);
router.get('/unlink/facebook', ctrlAuth3dParty.unlinkFacebook);
router.get('/unlink/github', ctrlAuth3dParty.unlinkGithub);
router.get('/unlink/google', ctrlAuth3dParty.unlinkGoogle);
router.get('/unlink/twitter', ctrlAuth3dParty.unlinkTwitter);
router.get('/unlink/linkedin', ctrlAuth3dParty.unlinkLinkedin);

module.exports = router;