'user strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var async = require('async');

var mongoose = require('mongoose');
require('../app_server/models/users');

mongoose.connect('mongodb://localhost/test-db');
var User = mongoose.model('User');

var user;
var csrftoken;
var connectionSid;

var NEW_NAME = 'Fake name';
var NEW_EMAIL = 'fake@email.com';
var NEW_PASSWORD = 'Password2';

const registerMock = {
	name: NEW_NAME,
	email : NEW_EMAIL,
	password : NEW_PASSWORD
};

describe('users', () => {

	function updateCookiesAndTokens(done) {
		agent
		.get('/login')
		.end((err1, res1) => {
			if(err1) {
				console.log("Error while calling login page");
				done(err1);
			} else {
				console.log(res1.headers['set-cookie']);

				csrftoken = (res1.headers['set-cookie']).filter(value =>{
					console.log(value);
					return value.includes('XSRF-TOKEN');
				})[0];
				connectionSid = (res1.headers['set-cookie']).filter(value =>{
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
		user.local.name = NEW_NAME;
		user.local.email = NEW_EMAIL;
		user.setPassword(NEW_PASSWORD);
		user.save((err, usr) => {
			if(err) {
				done(err);
			}
			user._id = usr._id;
			console.log("saved with id: " + user._id);
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
			console.log('collection removed') 
			done(err);
		});
	}

	describe('#register()', () => {

		beforeEach(done => dropUserCollectionTestDb(done));
		
		describe('---YES---', () => {

			beforeEach(done => updateCookiesAndTokens(done));

			it('should correctly register a new user', done => {
	    		getPartialPostRequest('/api/register')
				.set('XSRF-TOKEN', csrftoken) //MANDATORY
				.send(registerMock)
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err);
					} else {
						expect(res.body.message).to.be.equals("User with email "  + registerMock.email + " registered.");
						
						if(err) {
							done(err);
						} else {
							User.findOne({ 'local.email': registerMock.email }, (err1, user) => {
						        expect(user.local.name).to.be.equals(registerMock.name);
						        expect(user.local.email).to.be.equals(registerMock.email);
						       	expect(user.validPassword(registerMock.password));
						        expect(user.local.activateAccountExpires).to.be.not.null;
						        expect(user.local.activateAccountToken).to.be.not.null;
						        expect(user.local.activateAccountExpires).to.be.not.undefined;
						        expect(user.local.activateAccountToken).to.be.not.undefined;
						        done(err1);
						    });
						}
					}
				});
			});

			afterEach(done => dropUserCollectionTestDb(done));
		});

		describe('---NO---', () => {
			beforeEach(done => updateCookiesAndTokens(done));

			it('should get 400 BAD REQUEST, because user already exists', done => {
				async.waterfall([
					asyncDone => insertUserTestDb(asyncDone),
					asyncDone => {
						getPartialPostRequest('/api/register')
						.set('XSRF-TOKEN', csrftoken) //MANDATORY
						.send(registerMock)
						.expect(400)
						.end((err, res) => {
							if (err) {
								asyncDone(err, null);
							} else {
								asyncDone(err, res.body);
							}
						});
					}
				], (err, response) => {
					if (err) { 
						done(err);
					} else {
						expect(response.message).to.be.equals("User already exists. Try to login.");
						done();
					}
				});
			});
			
			const wrongRegisterMocks = [
				{name: NEW_NAME, email : NEW_EMAIL},
				{name: NEW_NAME, password : NEW_PASSWORD},
				{email : NEW_EMAIL, password : NEW_PASSWORD},
				{name: NEW_NAME},
				{email : NEW_EMAIL},
				{password : NEW_PASSWORD},
				{}
			];

			//these are multiple tests that I'm execting for all cobinations
			//of missing params
			for(let i = 0; i<wrongRegisterMocks.length; i++) {
				console.log(wrongRegisterMocks[i]);
				it('should get 400 BAD REQUEST, because you must pass all mandatory params. Test i= ' + i, done => {
					
					beforeEach(done => updateCookiesAndTokens(done));

					async.waterfall([
						asyncDone => insertUserTestDb(asyncDone),
						asyncDone => {
							getPartialPostRequest('/api/register')
							.set('XSRF-TOKEN', csrftoken) //MANDATORY
							.send(wrongRegisterMocks[i])
							.expect(400)
							.end((err, res) => {
								if (err) {
									asyncDone(err, null);
								} else {
									asyncDone(err, res.body);
								}
							});
						}
					], (err, response) => {
						if (err) { 
							done(err);
						} else {
							expect(response.message).to.be.equals("All fields required");
							done();
						}
					});

					afterEach(done => dropUserCollectionTestDb(done));
				});
			}

			afterEach(done => dropUserCollectionTestDb(done));
		});
		
		describe('---ERRORS---', () => {
			it('should get 403 FORBIDDEN, because XSRF-TOKEN is not available', done => {
				getPartialPostRequest('/api/register')
				//XSRF-TOKEN NOT SETTED!!!!
				.send(registerMock)
				.expect(403)
				.end(() => done());
			});
		});
	});
});