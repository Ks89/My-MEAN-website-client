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
	done();
});

describe('users model', () => {

	//CREATE A REAL TEST CASE, BECAUSE THIS IS WRONG

	describe('#setPassword()', () => {

		

		describe('---YES---', () => {

			beforeEach(done => {
				var newUser = new User();
				newUser.local.name = USERNAME;
				newUser.local.email = EMAIL;
				newUser.setPassword(PASSWORD);
				newUser.google = {};
				newUser.twitter = {};
				newUser.linkedin = {};
				newUser.facebook = {};
				newUser.github.id = 'github id';
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
					done(err);
				});
			});

			it('should create a user and verify it with a correct password', done => {
				
				mockedRes.session.authToken = 'pippo';
				
				var newUser = new User();
				newUser.google.id = 'google id';
				newUser.google.email = EMAIL;
				newUser.google.name = 'fake name';
				newUser.google.token = 'token google';
				newUser.github.id = 'github id';
				newUser.github.token = 'TOKEN';
				newUser.github.email = EMAIL;
				newUser.github.name = USERNAME;
				newUser.github.username = USERNAME;
				newUser.github.profileUrl = 'http://fakeprofileurl.com/myprofile';
				newUser.save((err, savedUser) => {
					expect(err).to.be.null;
					userDb = newUser;
					
					collapser.collapseDb(userDb, 'github', mockedRes)
		            .then(result => {
		              console.log("collapseDb localuser with 3dpartyauth promise");
		              console.log(result);
		              done();
		            }, reason => {
		              console.log("ERROR collapseDb localuser with 3dpartyauth promise");
		              done(null);
		            });

				});
			});

			afterEach(done => {
				User.remove({}, err => { 
					console.log('collection removed') 
					done(err);
				});
			});
		});

		
	});
});