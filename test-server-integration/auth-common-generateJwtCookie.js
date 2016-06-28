'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var async = require('async');

require('../app_server/models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var authCommon = require('../app_server/controllers/authentication/common/auth-common');

var user;
var csrftoken;
var connectionSid;

var NEW_NAME = 'Fake name';
var NEW_EMAIL = 'fake@email.com';
var NEW_PASSWORD = 'Password2';

const loginMock = {
	email : NEW_EMAIL,
	password : NEW_PASSWORD
};

const USER_MUSTBE_OBJECT = 'User must be a valid object';

const URL_LOGIN = '/api/login';
const URL_BASE_DECODE_TOKEN = '/api/decodeToken/';
const URL_LOGOUT = '/api/logout';

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
		user.local.name = NEW_NAME;
		user.local.email = NEW_EMAIL;
		user.setPassword(NEW_PASSWORD);
		user.save((err, usr) => {
			if(err) {
				done(err);
			}
			user._id = usr._id;
			updateCookiesAndTokens(done); //pass done, it's important!
		});
	}

	function dropUserCollectionTestDb(done) {
		User.remove({}, err => { 
			done(err);
		}); 
	}

	//usefull function that prevent to copy and paste the same code
	function getPartialGetRequest (apiUrl) {
		return agent
		.get(apiUrl)
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json');
	}

	function getPartialPostRequest (apiUrl) {
		return agent
		.post(apiUrl)
		.set('Content-Type', 'application/json')
		.set('Accept', 'application/json')
		.set('set-cookie', 'connect.sid=' + connectionSid)
		.set('set-cookie', 'XSRF-TOKEN=' + csrftoken);
	}

	describe('#generateJwtCookie()', () => {

		describe('---YES---', () => {

			beforeEach(done => insertUserTestDb(done));

			it('should return true, because it removes the specified service.', done => {
				const jwtSessionToken = authCommon.generateJwtCookie(user);
				const parsedJwtSessionToken =  JSON.parse(jwtSessionToken).token;
				
				async.waterfall([
					asyncDone => {
						getPartialPostRequest(URL_LOGIN)
						.set('XSRF-TOKEN', csrftoken)
						.send(loginMock)
						.expect(200)
						.end((err, res) => asyncDone(err, res));
					},
					(res, asyncDone) => {
						getPartialGetRequest(URL_BASE_DECODE_TOKEN + parsedJwtSessionToken)
						.send()
						.expect(200)
						.end((err, res) => {
							expect(res.body).to.be.not.undefined;
							expect(res.body).to.be.not.null;
							const usr = JSON.parse(res.body);
							expect(usr.user.local.email).to.be.equals(NEW_EMAIL);
							expect(usr.user.local.name).to.be.equals(NEW_NAME);
							expect(usr.exp).to.be.not.undefined;
							expect(usr.iat).to.be.not.undefined;
							asyncDone(err);
						});
				}], (err, response) => done(err));	
			});
			

			afterEach(done => dropUserCollectionTestDb(done));
		});



		describe('---ERRORS---', () => { 

			it('should catch an exception, because user must be a valid object', done => {
				
				expect(()=>authCommon.generateJwtCookie("")).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(-2)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(-1)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(-0)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(0)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(1)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(2)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(null)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(undefined)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(function(){})).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(()=>{})).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(/fooRegex/i)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie([])).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(new Error())).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(new RegExp(/fooRegex/,'i'))).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(new RegExp('/fooRegex/','i'))).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(new Date())).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(new Array())).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(true)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.generateJwtCookie(false)).to.throw(USER_MUSTBE_OBJECT);
	
				done();
			});

		});
	});
});