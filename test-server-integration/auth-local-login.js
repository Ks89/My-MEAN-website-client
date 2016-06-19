'user strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);

require('../app_server/models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var user;
var csrftoken;
var connectionSid;

const USER_NAME = 'username';
const USER_EMAIL = 'email@email.it';
const USER_PASSWORD = 'Password1';

const LOGIN_WRONG_EMAIL = 'WRONG@email.it';
const LOGIN_WRONG_PASSWORD = 'Password2';

const loginMock = {
	email : USER_EMAIL,
	password : USER_PASSWORD
};

const wrongLoginMock = {
	email : LOGIN_WRONG_EMAIL,
	password : LOGIN_WRONG_PASSWORD
};

describe('users', () => {

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

	//usefull function that prevent to copy and paste the same code
	function getPartialPostRequest (apiUrl) {
		return agent
			.post(apiUrl)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('set-cookie', 'connect.sid=' + connectionSid)
			.set('set-cookie', 'XSRF-TOKEN=' + csrftoken);
	}

	function dropUserCollectionTestDb(done) {
		User.remove({}, err => { 
			done(err);
		});
	}

	describe('#login()', () => {
		describe('---YES---', () => {

			beforeEach(done => insertUserTestDb(done));

			it('should correctly login', done => {
				getPartialPostRequest('/api/login')
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

			afterEach(done => dropUserCollectionTestDb(done));
		});

		describe('---NO - Wrong params---', () => {
			before(done => insertUserTestDb(done));

			const wrongLoginMocks = [
				{email : USER_EMAIL, password : LOGIN_WRONG_PASSWORD},
				{email: LOGIN_WRONG_EMAIL, password : USER_PASSWORD},
				{email : LOGIN_WRONG_EMAIL, password : LOGIN_WRONG_PASSWORD}
			];

			//these are multiple tests that I'm execting for all cobinations
			//of wrong params
			for(let i = 0; i<wrongLoginMocks.length; i++) {
				console.log(wrongLoginMocks[i]);
				it('should get 401 UNAUTHORIZED, because the correct input params are wrong. Test i= ' + i, done => {
					getPartialPostRequest('/api/login')
					.set('XSRF-TOKEN', csrftoken)
					.send(wrongLoginMocks[i])
					.expect(401)
					.end((err, res) => {
						if (err) {
							return done(err);
						} else {
							expect(res.body.message).to.be.equals("Incorrect username or password. Or this account is not activated, check your mailbox.");
							done(err);
						}
					});
				});
			}

			it('should get 400 BAD REQUEST, because the correct input params are wrong ' + 
				'(passed name and blabla insted of emailand password).', done => {

				getPartialPostRequest('/api/login')
				.set('XSRF-TOKEN', csrftoken)
				.send({name: 'wrong_name_param', blabla: 'wrong_name_param', })
				.expect(400)
				.end((err, res) => {
					if (err) {
						return done(err);
					} else {
						expect(res.body.message).to.be.equals("All fields required");
						done(err);
					}
				});
			});

			after(done => dropUserCollectionTestDb(done));	
		});

		describe('---NO - MISSING params---', () => {
			before(done => insertUserTestDb(done));

			const missingLoginMocks = [
				{email: USER_EMAIL},
				{password : USER_PASSWORD},
				{}
			];

			//these are multiple tests that I'm execting for all cobinations
			//of missing params
			for(let i = 0; i<missingLoginMocks.length; i++) {
				console.log(missingLoginMocks[i]);

				it('should get 400 BAD REQUEST, because input params are missing. Test i= ' + i, done => {
					getPartialPostRequest('/api/login')
					.set('XSRF-TOKEN', csrftoken)
					.send(missingLoginMocks[i])
					.expect(400)
					.end((err, res) => {
						if (err) {
							return done(err);
						} else {
							expect(res.body.message).to.be.equals("All fields required");
							done(err);
						}
					});
				});
			}

			after(done => dropUserCollectionTestDb(done));	
		});

		describe('---NO - NOT ACTIVATED---', () => {
			before(done => insertUserTestDb(done));

			const activateCombinations = [
				{token : 'FAKE_TOKEN', expires : new Date()},
				{token : 'FAKE_TOKEN', expires : undefined},
				{token : undefined, expires : new Date()}
			];

			//these are multiple tests that I'm execting for all cobinations
			//of activation token+expires
			for(let i = 0; i<activateCombinations.length; i++) {
				console.log(activateCombinations[i]);

				it('should get 401 UNAUTHORIZED, because this account is not activated. Test i= ' + i, done => {
					before(done => {
						user = new User();
						user.local.name = USER_NAME;
						user.local.email = USER_EMAIL;
						user.setPassword(USER_PASSWORD);
						user.local.activateAccountToken = activateCombinations[i].token;
						user.local.activateAccountExpires = activateCombinations[i].expires;
						user.save((err, usr) => {
							if(err) {
								done(err);
							}
							user._id = usr._id;
							updateCookiesAndTokens(done); //pass done, it's important!
						});
					});

					getPartialPostRequest('/api/login')
					.set('XSRF-TOKEN', csrftoken)
					.send(wrongLoginMock)
					.expect(401)
					.end((err, res) => {
						if (err) {
							return done(err);
						} else {
							expect(res.body.message).to.be.equals("Incorrect username or password. Or this account is not activated, check your mailbox.");
							done(err);
						}
					});
				});
				
				after(done => dropUserCollectionTestDb(done));	
			}
		});
		
		describe('---ERRORS---', () => {
			it('should get 403 FORBIDDEN, because XSRF-TOKEN is not available', done => {
				getPartialPostRequest('/api/login')
				//XSRF-TOKEN NOT SETTED!!!!
				.send(loginMock)
				.expect(403)
				.end(() => done());
			});
		});
	});
});