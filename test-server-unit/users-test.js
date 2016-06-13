'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var _und = require('underscore');

var User;
var mongoose = require('mongoose');
require('../app_server/models/users');

before(done => {
	// Connecting to a local test database or creating it on the fly
	mongoose.connect('mongodb://localhost/user_test');
	User = mongoose.model('User');
	done();
});

describe('users model', () => {

	const USERNAME = 'username';
	const EMAIL = 'email@email.it';
	const PASSWORD = 'Password1';

	function getCorrectNewUser() {
		var newUser = new User();
		newUser.local.name = USERNAME;
		newUser.local.email = EMAIL;
		newUser.setPassword(PASSWORD);
		return newUser;
	}

	describe('#setPassword()', () => {

		const NOT_VALID_PASSWORD_FORMAT = 'not a valid password format';

		describe('---YES---', () => {
			it('should create a user and verify it with a correct password', done => {
				var newUser = new User();
				newUser.setPassword(PASSWORD);
				newUser.save((err, savedUser) => {
					expect(err).to.be.null;
					console.log(savedUser.validPassword(PASSWORD));
					expect(savedUser.validPassword(PASSWORD)).to.be.true;
					done(err);
				});
			});
		});

		describe('---ERRORS---', () => {
			it('should catch -not a valid password format- exception', done => {
				var newUser = new User();
				expect(() => newUser.setPassword(new Date())).to.throw(NOT_VALID_PASSWORD_FORMAT);
				expect(() => newUser.setPassword(undefined)).to.throw(NOT_VALID_PASSWORD_FORMAT);
				expect(() => newUser.setPassword(null)).to.throw(NOT_VALID_PASSWORD_FORMAT);
				expect(() => newUser.setPassword(-1)).to.throw(NOT_VALID_PASSWORD_FORMAT);
				expect(() => newUser.setPassword(1)).to.throw(NOT_VALID_PASSWORD_FORMAT);
				expect(() => newUser.setPassword(function(){})).to.throw(NOT_VALID_PASSWORD_FORMAT);
				expect(() => newUser.setPassword(()=>{})).to.throw(NOT_VALID_PASSWORD_FORMAT);
				expect(() => newUser.setPassword(/fooRegex/i)).to.throw(NOT_VALID_PASSWORD_FORMAT);
				expect(() => newUser.setPassword(new RegExp(/fooRegex/,'i'))).to.throw(NOT_VALID_PASSWORD_FORMAT);
				expect(() => newUser.setPassword(new RegExp('/fooRegex/','i'))).to.throw(NOT_VALID_PASSWORD_FORMAT);
				done();
			});
		});

	});

	describe('#validPassword()', () => {
		describe('---YES---', () => {
			it('should create a user and verify it with a correct password', done => {
				var newUser = getCorrectNewUser();
				newUser.save((err, savedUser) => {
					expect(err).to.be.null;
					expect(savedUser.local.name).to.be.equals(USERNAME);
					expect(savedUser.local.email).to.be.equals(EMAIL);
					expect(savedUser.validPassword(PASSWORD)).to.be.true;
					done(err);
				});
			});
		});

		describe('---NO---', () => {
			it('should create a user and verify it with a wrong password', done => {
				var newUser = getCorrectNewUser();
				newUser.save((err, savedUser) => {
					expect(err).to.be.null;
					expect(savedUser.local.name).to.be.equals(USERNAME);
					expect(savedUser.local.email).to.be.equals(EMAIL);
					expect(savedUser.validPassword('wrong password')).to.be.false;
					done(err);
				});
			});
		});
	});


	describe('#generateJwt()', () => {
		describe('---YES---', () => {
			it('should generate a JWT', done => {
				var newUser = getCorrectNewUser();
				//newUser
				done()
			});
		});
	});

	after(done => {
		User.remove({}, function(err) { 
			console.log('collection removed') 
			done(err);
		});
	});
});