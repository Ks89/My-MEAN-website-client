'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var async = require('async');

require('../app_server/models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var user;
var csrftoken;
var connectionSid;

const USER_NAME = 'fake user';
const USER_EMAIL = 'fake@email.com';
const USER_PASSWORD = 'fake';

const URL_LOGIN = '/api/login';
const URL_LOGOUT = '/api/logout';

// testing services
const URL_DESTROY_SESSION = '/api/testing/destroySession';
const URL_SET_STRING_SESSION = '/api/testing/setStringSession';
const URL_SET_JSON_WITHOUT_TOKEN_SESSION = '/api/testing/setJsonWithoutTokenSession';
const URL_SET_JSON_WITH_WRONGFORMAT_TOKEN_SESSION = '/api/testing/setJsonWithWrongFormatTokenSession';
const URL_SET_JSON_WITH_EXPIRED_DATE_SESSION = '/api/testing/setJsonWithExpiredDateSession';


const loginMock = {
	email : USER_EMAIL,
	password : USER_PASSWORD
};


describe('rest-auth-middleware', () => {

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

	function dropUserTestDbAndLogout(done) {
		User.remove({}, err => {
			//I want to try to logout to be able to run all tests in a clean state
			//If this call returns 4xx or 2xx it's not important here
			getPartialGetRequest(URL_LOGOUT)
			.send()
			.end((err, res) => done(err));
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

	//useful function that prevent to copy and paste the same code
	function getPartialGetRequest (apiUrl) {
		return agent
		.get(apiUrl)
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json');
	}

	describe('#restAuthenticationMiddleware()', () => {
		describe('---YES---', () => {

			beforeEach(done => insertUserTestDb(done));

			it('should login', done => {
  			getPartialPostRequest(URL_LOGIN)
  			.set('XSRF-TOKEN', csrftoken)
  			.send(loginMock)
  			.expect(200)
  			.end((err, res) => {
          if (err) {
						return done(err);
					} else {
						expect(res.body.token).to.be.not.null;
						expect(res.body.token).to.be.not.undefined;
						done(err);
					}
        });
			});

			afterEach(done => dropUserTestDbAndLogout(done));
		});

		describe('---ERRORS---', () => {
      const sessionModifierUrls = [
        {url: URL_DESTROY_SESSION, msg: 'No token provided', status: 403},
        {url: URL_SET_STRING_SESSION, msg: 'No token provided', status: 403},
        {url: URL_SET_JSON_WITHOUT_TOKEN_SESSION, msg: 'Token not found', status: 404},
        {url: URL_SET_JSON_WITH_WRONGFORMAT_TOKEN_SESSION, msg: 'Jwt not valid or corrupted', status: 401},
				{url: URL_SET_JSON_WITH_EXPIRED_DATE_SESSION, msg: 'Data is not valid', status: 404}
      ];
      for(let i=0; i<sessionModifierUrls.length; i++) {
        it(`should get 403 FORBIDDEN while calling a protected service
                (for instance, logout()), because you aren't authenticated.
                Test i=${i} with ${sessionModifierUrls[i]}`, done => {
  				async.waterfall([
  					asyncDone => {
  						getPartialGetRequest(sessionModifierUrls[i].url)
  						.send()
  						.expect(200)
  						.end((err, res) => asyncDone(err, res));
  					},
  					(res, asyncDone) => {
  						getPartialGetRequest(URL_LOGOUT)
  						.send()
  						.expect(sessionModifierUrls[i].status) // expected status
  						.end((err, res) => {
  							// session data is modified
  							// and the rest-auth-middleware blocks your call
                // returning a specific error message
  							expect(res.body.message).to.be.equals(sessionModifierUrls[i].msg);
  							asyncDone(err);
  						});
  					}], (err, response) => done(err));
  			});
      }

			afterEach(done => dropUserTestDbAndLogout(done));
		});
	});
});
