'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

//to be able to use generateJwt I must import 
//dotenv (otherwise I cannot read process.env with the encryption key)
require('dotenv').config();

var chai = require('chai');
var expect = chai.expect;
var _und = require('underscore');
var jwt = require('jsonwebtoken');

var User;
var mongoose = require('mongoose');
require('../app_server/models/users');

before(done => {
	// Connecting to a local test database or creating it on the fly
	mongoose.connect('mongodb://localhost/test-db');
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
			it('should generate a valid JWT', done => {
				var newUser = getCorrectNewUser();
				const jasonWebToken = newUser.generateJwt();
				expect(jasonWebToken).is.not.null;
				jwt.verify(jasonWebToken, process.env.JWT_SECRET, (err, decoded) => {
		      expect(err).is.null;
		      expect(decoded).is.not.null;
		  		expect(decoded.user).is.not.null;
		  		expect(decoded.user.local).is.not.null;
		  		expect(decoded.user.local.name).to.be.equals(USERNAME);
		  		expect(decoded.user.local.email).to.be.equals(EMAIL);
		  		done(err)
		    });
			});

			it('should generate a valid JWT with the correct filtered user', done => {
				var newUser = new User();
				newUser.local.name = USERNAME;
				newUser.local.email = EMAIL;
				newUser.setPassword(PASSWORD);
				newUser.local.activateAccountToken = 'TOKEN';
        newUser.local.activateAccountExpires =  new Date(Date.now() + 24*3600*1000); // 1 hour
				newUser.local.resetPasswordToken = 'TOKEN';
        newUser.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour
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
        
				const jsonWebToken = newUser.generateJwt();
				expect(jsonWebToken).to.be.not.null;
				jwt.verify(jsonWebToken, process.env.JWT_SECRET, (err, decoded) => {
		      expect(err).to.be.null;
		      expect(decoded).to.be.not.null;
		  		expect(decoded.user).to.be.not.null;
		  		expect(decoded.user._id).to.be.equals(newUser._id+'');
		  		expect(decoded.user.__v).to.be.undefined;
		  		expect(decoded.user.local).to.be.not.null;
		  		expect(decoded.user.local.name).to.be.equals(USERNAME);
		  		expect(decoded.user.local.email).to.be.equals(EMAIL);
		  		expect(decoded.user.local.hash).to.be.not.undefined;
		  		expect(decoded.user.local.activateAccountToken).to.be.undefined;
		  		expect(decoded.user.local.activateAccountExpires).to.be.undefined;
		  		expect(decoded.user.local.resetPasswordToken).to.be.undefined;
		  		expect(decoded.user.local.resetPasswordExpires).to.be.undefined;

		  		expect(decoded.user.github.id).to.be.equals('1231232');
          expect(decoded.user.github.token).to.be.undefined;
          expect(decoded.user.github.email).to.be.equals(EMAIL);
          expect(decoded.user.github.name).to.be.equals(USERNAME);
          expect(decoded.user.github.username).to.be.undefined;
          expect(decoded.user.github.profileUrl).to.be.undefined;

          expect(decoded.user.profile.name).to.be.equals(USERNAME);
          expect(decoded.user.profile.surname).to.be.equals(USERNAME);
          expect(decoded.user.profile.nickname).to.be.equals(USERNAME);
          expect(decoded.user.profile.email).to.be.equals(EMAIL);
          expect(decoded.user.profile.updated).to.be.undefined;
          expect(decoded.user.profile.visible).to.be.true;

		  		done(err)
		    });
			});
		});
	});

	after(done => {
		User.remove({}, err => { 
			console.log('collection removed') 
			done(err);
		});
	});
});