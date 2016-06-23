'user strict';
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

const jwtMock = {
  "_id": "57686655022691a4306b76b9",
  "user": {
    "_id": "57686655022691a4306b76b9",
    "__v": 0,
    "local": {
      "hash": "$2a$10$hHCcxNQmzzNCecReX1Rbeu5PJCosbjITXA1x./feykYcI2JW3npTW",
      "email": "fake@email.it",
      "name": "fake username"
    }
  },
  "exp": 1466721597694,
  "iat": 1466720997
};

const jwtStringMock = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1NzZjNjY4OThhYjdhNDQyMGU3YTk2ZTAiLCJ1c2VyIjp7Il9pZCI6IjU3NmM2Njg5OGFiN2E0NDIwZTdhOTZlMCIsIl9fdiI6MCwibG9jYWwiOnsiaGFzaCI6IiQyYSQxMCQ4MHVpNXdycnZhQjRXMDA2Zm1sWmF1Qjl3WUVnemFnQnpDTEkzbktuQTJVWGk3VW9QbHdSdSIsImVtYWlsIjoiZmFrZUBlbWFpbC5jb20iLCJuYW1lIjoiZmFrZSB1c2VyIn19LCJleHAiOjE0NjY3MjI1NzM3NzgsImlhdCI6MTQ2NjcyMTk3M30.rDUHwF4wmVIKBkI7ef7JC3SXOZ7YHLhf96OM_1MBD2g";

const loginMock = {
	email : USER_EMAIL,
	password : USER_PASSWORD
};

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
			
			it('should correctly activate an account', done => {

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

						getPartialGetRequest('/api/decodeToken/' + jwtStringMock)
						.send()
						.expect(200)
						.end((err, res) => {
							if (err) {
								return asyncDone(err);
							} else {
								console.log(res.body);
								asyncDone();
							}
						});
						}
				], (err, response) => done(err));
			});

			afterEach(done => dropUserTestDbAndLogout(done));

		});


	});
});