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

const RESET_WRONG_EMAIL = 'notexisting@email.com';

const resetMock = {
	email : USER_EMAIL
};

const wrongResetMock = {
	email : RESET_WRONG_EMAIL
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

	describe('#reset()', () => {
		describe('---YES---', () => {

			beforeEach(done => insertUserTestDb(done));

			it('should correctly reset password', done => {
				getPartialPostRequest('/api/reset')
				.set('XSRF-TOKEN', csrftoken)
				.send(resetMock)
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err);
					} else {
						expect(res.body.message).to.be.equals('An e-mail has been sent to ' + USER_EMAIL + ' with further instructions.');
						if(err) {
							done(err);
						} else {
							User.findOne({ 'local.email': resetMock.email }, (err1, user) => {
						        expect(user.local.name).to.be.equals(USER_NAME);
						        expect(user.local.email).to.be.equals(USER_EMAIL);
						       	expect(user.validPassword(USER_PASSWORD)).to.be.true;
						        expect(user.local.resetPasswordExpires).to.be.not.null;
						        expect(user.local.resetPasswordToken).to.be.not.null;
						        expect(user.local.resetPasswordExpires).to.be.not.undefined;
						        expect(user.local.resetPasswordToken).to.be.not.undefined;
						        done(err1);
						    });
						}
					}
				});
			});

			afterEach(done => dropUserCollectionTestDb(done));
		});


		describe('---NO - MISSING params---', () => {
			before(done => insertUserTestDb(done));

			const missingLoginMocks = [
				{email : null},
				{email : undefined},
				{}
			];

			//these are multiple tests that I'm execting for all cobinations
			//of wrong params
			for(let i = 0; i<missingLoginMocks.length; i++) {
				console.log(missingLoginMocks[i]);
				it('should get 400 BAD REQUEST, because email param is mandatory.', done => {
					getPartialPostRequest('/api/reset')
					.set('XSRF-TOKEN', csrftoken)
					.send(missingLoginMocks[i])
					.expect(400)
					.end((err, res) => {
						if (err) {
							return done(err);
						} else {
							expect(res.body.message).to.be.equals("Email fields is required.");
							done(err);
						}
					});
				});
			}

			it('should get 404 NOT FOUND, because the request email is not found.', done => {
				getPartialPostRequest('/api/reset')
				.set('XSRF-TOKEN', csrftoken)
				.send({email : RESET_WRONG_EMAIL})
				.expect(404)
				.end((err, res) => {
					if (err) {
						return done(err);
					} else {
						console.log(res.body.message);
						expect(res.body.message).to.be.equals("No account with that email address exists.");
						done(err);
					}
				});
			});
							
			after(done => dropUserCollectionTestDb(done));		
		});
		
		describe('---ERRORS---', () => {
			it('should get 403 FORBIDDEN, because XSRF-TOKEN is not available', done => {
				getPartialPostRequest('/api/reset')
				//XSRF-TOKEN NOT SETTED!!!!
				.send(resetMock)
				.expect(403)
				.end(() => done());
			});
		});
	});
});