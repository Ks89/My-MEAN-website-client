'user strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var async = require('async');
var jwt = require('jsonwebtoken');

require('../app_server/models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var user;
var csrftoken;
var connectionSid;
var jwtStringToken;

const USER_NAME = 'fake user';
const USER_EMAIL = 'fake@email.com';
const USER_PASSWORD = 'fake';

const URL_LOGIN = '/api/login';
const URL_LOGOUT = '/api/logout';
const URL_BASE_DECODE_TOKEN = '/api/decodeToken/';

const jwtMock = {
	"_id": "57686655022691a4306b76b9",
	"user": {
		"_id": "57686655022691a4306b76b9",
		"__v": 0,
		"local": {
			"hash": "$2a$10$hHCcxNQmzzNCecReX1Rbeu5PJCosbjITXA1x./feykYcI2JW3npTW",
			"email": USER_EMAIL,
			"name": USER_NAME
		}
	},
	"exp": 1466721597694,
	"iat": 1466720997
};

const loginMock = {
	email : USER_EMAIL,
	password : USER_PASSWORD
};

const jwtWrongDateStringToken = function () {
	var expiry = new Date();
  expiry.setTime(expiry.getTime() - 600000); //expired 10 minutes ago (10*60*1000)

  return jwt.sign({
  	_id: this._id,
     //I don't want to expose private information here -> I filter 
     //the user object into a similar object without some fields
     user: {
     	"local": {
     		"hash": "$2a$10$hHCcxNQmzzNCecReX1Rbeu5PJCosbjITXA1x./feykYcI2JW3npTW",
     		"email": USER_EMAIL,
     		"name": USER_NAME
     	}
     },
     exp: parseFloat(expiry.getTime()),
 }, process.env.JWT_SECRET);
}

describe('auth-common', () => {

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
			jwtStringToken = user.generateJwt();
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

	//usefull function that prevent to copy and paste the same code
	function getPartialGetRequest (apiUrl) {
		return agent
		.get(apiUrl)
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json');
	}

	describe('#decodeToken()', () => {
		describe('---YES---', () => {

			beforeEach(done => insertUserTestDb(done));

			it('should decode a jwt token', done => {

				async.waterfall([
					asyncDone => {
						getPartialPostRequest(URL_LOGIN)
						.set('XSRF-TOKEN', csrftoken)
						.send(loginMock)
						.expect(200)
						.end((err, res) => asyncDone(err, res));
					},
					(res, asyncDone) => {
						expect(res.body.token).to.be.not.null;
						expect(res.body.token).to.be.not.undefined;

						getPartialGetRequest(URL_BASE_DECODE_TOKEN + jwtStringToken)
						.send()
						.expect(200)
						.end((err, res) => {
							expect(res.body).to.be.not.undefined;
							expect(res.body).to.be.not.null;
							const usr = JSON.parse(res.body);
							expect(usr.user.local.email).to.be.equals(jwtMock.user.local.email);
							expect(usr.user.local.name).to.be.equals(jwtMock.user.local.name);
							expect(usr.exp).to.be.not.undefined;
							expect(usr.iat).to.be.not.undefined;
							asyncDone(err);
						});
					}], (err, response) => done(err));
			});

			afterEach(done => dropUserTestDbAndLogout(done));
		});


		describe('---ERRORS---', () => {

			beforeEach(done => insertUserTestDb(done));
			
			it('should 401 UNAUTHORIZED, because token isn\'t defined', done => {
				async.waterfall([
					asyncDone => {
						getPartialPostRequest(URL_LOGIN)
						.set('XSRF-TOKEN', csrftoken)
						.send(loginMock)
						.expect(200)
						.end((err, res) => asyncDone(err, res));
					},
					(res, asyncDone) => {
						getPartialGetRequest(URL_BASE_DECODE_TOKEN + 'fakeRandom')
						.send()
						.expect(401)
						.end((err, res) => {
							expect(res.body.message).to.be.equals('Jwt not valid or corrupted');
							asyncDone(err);
						});
					}], (err, response) => done(err));
			});


			it('should 401 UNAUTHORIZED, because token is expired', done => {
				async.waterfall([
					asyncDone => {
						getPartialPostRequest(URL_LOGIN)
						.set('XSRF-TOKEN', csrftoken)
						.send(loginMock)
						.expect(200)
						.end((err, res) => asyncDone(err, res));
					},
					(res, asyncDone) => {
						getPartialGetRequest(URL_BASE_DECODE_TOKEN + jwtWrongDateStringToken())
						.send()
						.expect(401)
						.end((err, res) => {
							expect(res.body.message).to.be.equals('Token Session expired (date).');
							asyncDone(err);
						});
					}], (err, response) => done(err));
			});

			it('should get 403 FORBIDDEN, because you aren\'t authenticated', done => {
				getPartialGetRequest(URL_BASE_DECODE_TOKEN + jwtStringToken)
				//not authenticated
				.send(loginMock)
				.expect(403)
				.end(() => done());
			});

			afterEach(done => dropUserTestDbAndLogout(done));
		});
	});
});