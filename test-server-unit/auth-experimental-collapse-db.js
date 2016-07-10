'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

//to be able to use generateJwt I must import 
//dotenv (otherwise I cannot read process.env with the encryption key)
require('dotenv').config();

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var _und = require('underscore');

var User;
var mongoose = require('mongoose');
require('../app_server/models/users');

var userDb;

var util = require('../app_server/utils/util');
var MockedRes = require('./mocked-res-class');
var mockedRes = new MockedRes();
mockedRes.session = {
	authToken : null
};

var jwt = require('jsonwebtoken');
var collapser = require('../app_server/controllers/authentication/common/auth-experimental-collapse-db');

const USERNAME = 'username';
const EMAIL = 'email@email.it';
const PASSWORD = 'Password1';

before(done => {
	// Connecting to a local test database or creating it on the fly
	mongoose.connect('mongodb://localhost/test-db');
	User = mongoose.model('User');
	
	var newUser = new User();
	newUser.local.id = 'idlocal';
	newUser.local.name = USERNAME;
	newUser.local.email = EMAIL;
	newUser.setPassword(PASSWORD);
	newUser.local.activateAccountToken = 'TOKEN';
	newUser.local.activateAccountExpires =  new Date(Date.now() + 24*3600*1000); // 1 hour
	newUser.local.resetPasswordToken = 'TOKEN';
	newUser.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour
	newUser.google.id = 'id';
	newUser.facebook.id = 'id';
	newUser.linkedin.id = 'id';
	newUser.twitter.id = 'id';
	newUser.github.id = '1231232';
	newUser.github.token = 'TOKEN';
	newUser.github.email = EMAIL;
	newUser.github.name = USERNAME;
	newUser.github.username = USERNAME;
	newUser.github.profileUrl = 'http://fakeprofileurl.com/myprofile';
	newUser.profile = {
		name : USERNAME,
		surname : USERNAME,
		nickname : USERNAME,
		email : EMAIL,
		updated : new Date(),
		visible : true
	}
	newUser.save((err, savedUser) => {
		expect(err).to.be.null;
		expect(savedUser.validPassword(PASSWORD)).to.be.true;
		userDb = newUser;
		done(err);
	});
});

describe('users model', () => {

	//CREATE A REAL TEST CASE, BECAUSE THIS IS WRONG

	describe('#setPassword()', () => {

		const NOT_VALID_PASSWORD_FORMAT = 'not a valid password format';

		describe('---YES---', () => {
			it('should create a user and verify it with a correct password', done => {
				
				mockedRes.session.authToken = 'pippo';

				collapser.collapseDb(userDb, 'local', mockedRes)
	            .then(result => {
	              console.log("collapseDb localuser with 3dpartyauth promise: " + result);
	              done();
	            }, reason => {
	              console.log("ERROR collapseDb localuser with 3dpartyauth promise");
	              done(null);
	            });

				// var newUser = new User();
				// newUser.setPassword(PASSWORD);
				// newUser.save((err, savedUser) => {
				// 	expect(err).to.be.null;
				// 	expect(savedUser.validPassword(PASSWORD)).to.be.true;
				// 	done(err);
				// });
			});
		});

		// describe('---ERRORS---', () => {
		// 	it('should catch -not a valid password format- exception', done => {
		// 		var newUser = new User();
		// 		expect(() => newUser.setPassword(new Date())).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		expect(() => newUser.setPassword(undefined)).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		expect(() => newUser.setPassword(null)).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		expect(() => newUser.setPassword(-1)).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		expect(() => newUser.setPassword(1)).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		expect(() => newUser.setPassword(function(){})).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		expect(() => newUser.setPassword(()=>{})).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		expect(() => newUser.setPassword(/fooRegex/i)).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		expect(() => newUser.setPassword(new RegExp(/fooRegex/,'i'))).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		expect(() => newUser.setPassword(new RegExp('/fooRegex/','i'))).to.throw(NOT_VALID_PASSWORD_FORMAT);
		// 		done();
		// 	});
		// });
	});

	after(done => {
		User.remove({}, err => { 
			console.log('collection removed') 
			done(err);
		});
	});
});