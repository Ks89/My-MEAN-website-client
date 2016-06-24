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

	describe('#logout()', () => {
		describe('---YES---', () => {

			beforeEach(done => insertUserTestDb(done));

			it('should logout', done => {

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

						getPartialGetRequest(URL_LOGOUT)
						.send()
						.expect(200)
						.end((err, res) => {
							expect(res.body.message).to.be.equals('Logout succeeded');
							asyncDone(err);
						});
					}], (err, response) => done(err));
			});

			afterEach(done => dropUserTestDbAndLogout(done));
		});


		describe('---ERRORS---', () => {

			beforeEach(done => insertUserTestDb(done));

			it('should get 403 FORBIDDEN, because you aren\'t authenticated', done => {
				getPartialGetRequest(URL_LOGOUT)
				//not authenticated
				.send(loginMock)
				.expect(403)
				.end(() => done());
			});

			afterEach(done => dropUserTestDbAndLogout(done));
		});
	});
});