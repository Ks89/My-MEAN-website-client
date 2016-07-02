'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var async = require('async');
var _und = require('underscore');

require('../app_server/models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var serviceNames = require('../app_server/controllers/authentication/serviceNames');

var user;
var csrftoken;
var connectionSid;

const USER_NAME = 'fake user';
const USER_EMAIL = 'fake@email.com';
const USER_PASSWORD = 'fake';
const FAKE_ID = 'fake_id';

const URL_LOGIN = '/api/login';
const URL_LOGOUT = '/api/logout';
const URL_BASE_UNLINK = '/api/unlink/';

const loginMock = {
	email : USER_EMAIL,
	password : USER_PASSWORD
};

const SESSION_NOT_VALID = 'Session not valid, probably it\'s expired';
const LOGOUT_SUCCEEDED = 'Logout succeeded';
const NO_TOKEN_PROVIDED = 'No token provided.';

//this file is usefull to test authCommon.unlinkServiceByName for 3dauth, 
//i.e. to call /unlink/****serviceName**** in auth-3dparty.js
//indirectly I'm testing authCommon.unlinkServiceByName, call rest services /unlink/...

describe('auth-experimental-collapse-db', () => {

	function updateCookiesAndTokens(done) {
		agent
		.get('/login')
		.end((err, res) => {
			if(err) {
				done(err);
			} else {
				csrftoken = (res.headers['set-cookie']).filter(value =>{
					return value.includes('XSRF-TOKEN');
				})[0];
				connectionSid = (res.headers['set-cookie']).filter(value =>{
					return value.includes('connect.sid');
				})[0];
				csrftoken = csrftoken ? csrftoken.split(';')[0].replace('XSRF-TOKEN=','') : '';
				connectionSid = connectionSid ? connectionSid.split(';')[0].replace('connect.sid=','') : '';
				done();
			}
		});
	}

	function insertUserTestDb(done) {
		user = new User();
		user.local.name = USER_NAME;
		user.local.email = USER_EMAIL;
		user.setPassword(USER_PASSWORD);
		user.save((err, usr) => {
			if(err) {
				done(err);
			}
			user._id = usr._id;
			updateCookiesAndTokens(done); //pass done, it's important!
		});
	}

	function insertUserLastUnlinkTestDb(serviceName, done) {
		user = new User();
		//i'm registering a local user that i'll 
		//use to login (because it's quicker than mock oauth2 authentication :)).
		//Also, I'm adding another service speicified by serviceName,
		//to do a real and usefull test
		user.local.name = USER_NAME;
		user.local.email = USER_EMAIL;
		user.setPassword(USER_PASSWORD);
		if(serviceName !== 'local') {
			user[serviceName] = { id : FAKE_ID };
		}
		user.save((err, usr) => {
			if(err) {
				done(err);
			}
			user._id = usr._id;
			updateCookiesAndTokens(done); //pass done, it's important!
		});
	}

	function dropUserTestDb(done) {
		User.remove({}, err => { 
			done(err);
		});
	}

	function getPartialPostRequest (apiUrl) {
		return agent
		.post(apiUrl)
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('set-cookie', 'connect.sid=' + connectionSid)
		.set('set-cookie', 'XSRF-TOKEN=' + csrftoken);
	}

	//usefull function that prevent to copy and paste the same code
	function getPartialGetRequest (apiUrl) {
		return agent
		.get(apiUrl)
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json');
	}

	describe('#collapseDb()', () => {
		describe('---YES---', () => {

			// describe('YES LAST UNLINK', () => {
			// 	//because I'm testing on 3dauth-unlink, I'm removing 'local'
			// 	var services3dAuth = _und.without(serviceNames, 'local');

			// 	for(let i=0; i<services3dAuth.length; i++) {
			// 		it('should remove ' + services3dAuth[i] + ' account from an user with only this account [YES LAST UNLINK].', done => {
			// 			async.waterfall([
			// 				asyncDone => insertUserLastUnlinkTestDb(services3dAuth[i], asyncDone),
			// 				asyncDone => {
			// 					//login as local user
			// 					getPartialPostRequest(URL_LOGIN)
			// 					.set('XSRF-TOKEN', csrftoken)
			// 					.send(loginMock)
			// 					.expect(200)
			// 					.end((err, res) => asyncDone(err, res));
			// 				},
			// 				(res, asyncDone) => {
			// 					//unlink local user, to leave only a 3dparty
			// 					// service (services3dAuth[i]), because
			// 					// in this test i want to test the last unlink's function
			// 					expect(res.body.token).to.be.not.null;
			// 					expect(res.body.token).to.be.not.undefined;

			// 					getPartialGetRequest(URL_BASE_UNLINK + 'local')
			// 					.send()
			// 					.expect(200)
			// 					.end((err, res) => {
			// 						console.log(res.body);
			// 						expect(res.body).to.be.equals("User unlinked correctly!");
			// 						asyncDone(err);
			// 					});
			// 				},
			// 				asyncDone => {
			// 					// I call unlink/*serviceName* to remove this account, however
			// 					// because this is the last account into the user object, 
			// 					// this is a LAST UNLINK!!!!
			// 					getPartialGetRequest(URL_BASE_UNLINK + services3dAuth[i])
			// 					.send()
			// 					.expect(200)
			// 					.end((err, res) => {
			// 						expect(res.body).to.be.equals("User unlinked correctly!");
			// 						asyncDone(err);
			// 					});
			// 				}], (err, response) => done(err));
			// 		});
			// 	}

			// 	afterEach(done => dropUserTestDb(done));

			// });
		});


		// describe('---ERRORS---', () => {

		// 	beforeEach(done => insertUserTestDb(done));

		// 	for(let i=0; i<serviceNames.length; i++) {
		// 		it('should get 403 FORBIDDEN, because you aren\'t authenticated. Test serviceName=' + serviceNames[i], done => {
		// 			getPartialGetRequest(URL_BASE_UNLINK + serviceNames[i])
		// 			//not authenticated
		// 			.send(loginMock)
		// 			.expect(403)
		// 			.end(() => done());
		// 		});


		// 		it('should catch an exception, because the session is not valid or expired.', done => {

		// 			async.waterfall([
		// 				asyncDone => {
		// 					getPartialPostRequest(URL_LOGIN)
		// 					.set('XSRF-TOKEN', csrftoken)
		// 					.send(loginMock)
		// 					.expect(200)
		// 					.end((err, res) => asyncDone(err, res));
		// 				},
		// 				(res, asyncDone) => { 
		// 					getPartialGetRequest(URL_LOGOUT)
		// 					.send()
		// 					.expect(200)
		// 					.end((err, res) => {
		// 						expect(res.body.message).to.be.equals(LOGOUT_SUCCEEDED);
		// 						asyncDone(err, res);
		// 					});
		// 				},
		// 				(res, asyncDone) => {
		// 					console.log(res.body);

		// 					getPartialGetRequest(URL_BASE_UNLINK + serviceNames[i])
		// 					.send()
		// 					.expect(403)
		// 					.end((err, res) => {
		// 						console.log(res.body);
		// 						expect(res.body.message).to.be.equals(NO_TOKEN_PROVIDED);
		// 						asyncDone(err);
		// 					});
		// 				}], (err, response) => done(err));
		// 		});
		// 	}

		// 	for(let i=0; i<serviceNames.length; i++) {
		// 		it('should get 403 FORBIDDEN, because you aren\'t authenticated. Test serviceName=' + serviceNames[i], done => {
		// 			getPartialGetRequest(URL_BASE_UNLINK + serviceNames[i])
		// 			//not authenticated
		// 			.send(loginMock)
		// 			.expect(403)
		// 			.end(() => done());
		// 		});
			
		// 		it('should catch an exception, because the session is not valid or expired. Test serviceName=' + serviceNames[i], done => {

		// 			async.waterfall([
		// 				asyncDone => {
		// 					getPartialPostRequest(URL_LOGIN)
		// 					.set('XSRF-TOKEN', csrftoken)
		// 					.send(loginMock)
		// 					.expect(200)
		// 					.end((err, res) => {
		// 						User.remove({}, err => { 
		// 							asyncDone(err, res);
		// 						});
		// 					});
		// 				},
		// 				(res, asyncDone) => {
		// 					console.log(res.body);
		// 					getPartialGetRequest(URL_BASE_UNLINK + serviceNames[i])
		// 					.send()
		// 					.expect(404)
		// 					.end((err, res) => {
		// 						expect(res.body.message).to.be.equals('User not found - cannot unlink');
		// 						asyncDone(err);
		// 					});
		// 				}], (err, response) => done(err));
		// 		});
		// 	}

		// 	afterEach(done => dropUserTestDb(done));
		// });
	});
});