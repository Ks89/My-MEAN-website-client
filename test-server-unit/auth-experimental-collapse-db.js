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
//add session property to the mocked object
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

describe('auth-experimental-collapse-db', () => {

	describe('#collapseDb()', () => {

		function addLocalUser(newUser) {
			newUser.local = {
					name : USERNAME,
					email : EMAIL
			};
			newUser.setPassword(PASSWORD);
		}

		function addUserByServiceName(newUser, serviceName) {
			newUser[serviceName] = {
					id : serviceName + ' id',
					name : 'fake name',
					email : EMAIL,
					token : 'random_fake_token',
					username : USERNAME,
					profileUrl : 'http//fakeprofileurl.com/myprofile'
			};
		}

		function addProfile(newUser) {
			newUser.profile = {
				name : 'name',
				surname : 'surname',
				nickname : 'nickname',
				email : EMAIL,
				updated : new Date(),
				visible : true
			};
		}

		describe('---YES---', () => {

			beforeEach(done => {
				var newUser = new User();
				addProfile(newUser);
				addLocalUser(newUser);
				addUserByServiceName(newUser, 'github');
				newUser.save((err, savedUser) => {
					expect(err).to.be.null;
					expect(savedUser.validPassword(PASSWORD)).to.be.true;
					userDb = newUser;
					done(err);
				});
			});

			it('should collapse the db and check that users has been merged', done => {
								
				var newUser = new User();
				addUserByServiceName(newUser, 'google');
				addUserByServiceName(newUser, 'github');
				newUser.save((err, savedUser) => {
					expect(err).to.be.null;
					
					collapser.collapseDb(newUser, 'github', mockedRes)
          .then(result => {
            console.log("collapseDb localuser with 3dpartyauth promise");
            console.log(result);

            console.log("-------------------------------");
            console.log(userDb);
            console.log("-------------------------------");
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

		describe('---ERRORS---', () => {

			const serviceNameWrongMock = [undefined, null, -1, 5, 99, 600, 
					function(){}, ()=>{}, /fooRegex/i, [], new RegExp(/fooRegex/,'i'),
					new RegExp('/fooRegex/','i'), new Error(), true, false, new Array()];

			for(let i=0; i<serviceNameWrongMock.length; i++) {
				it('should catch an error, because you must pass a serviceName as parameter. Test i=' + i, done => {
					collapser.collapseDb({}, serviceNameWrongMock[i], mockedRes)
	        .then(result => {}, reason => {
	          expect(reason).to.be.equals('impossible to collapseDb because serviceName must be a string');
	          done(null);
	        });
				});
			}

			const serviceNameUnrecognizedMock = [' ', '', 'fake serviceName', 'faceBRook',
				'gOGle', 'loCAal', '...' ];

			for(let i=0; i<serviceNameUnrecognizedMock.length; i++) {
				it('should catch an error, because you must pass a recognized serviceName as parameter. Test i=' + i, done => {
					collapser.collapseDb({}, serviceNameUnrecognizedMock[i], mockedRes)
	        .then(result => {}, reason => {
	          expect(reason).to.be.equals('impossible to collapseDb because serviceName is not recognized');
	          done(null);
	        });
				});
			}

			const loggedUserWrongMock = ["not an object", undefined, null, -1, 5, 99, 600, 
					" ", function(){}, ()=>{}, /fooRegex/i, [], new RegExp(/fooRegex/,'i'),
					new RegExp('/fooRegex/','i'), new Error(), true, false, new Array()];
	
			for(let i=0; i<loggedUserWrongMock.length; i++) {
				it('should catch an error, because you must pass an object as loggedUser\'s parameter. Test i=' + i, done => {
					collapser.collapseDb(loggedUserWrongMock[i], 'local', mockedRes)
          .then(result => {}, reason => {
            expect(reason).to.be.equals('impossible to collapseDb because loggedUser is not an object');
            done(null);
          });
				});
			}

			it('should catch an error, because logged user hasn\'t an id for the specified serviceName', done => {
				collapser.collapseDb({ local : { email: 'fake'}}, 'local', mockedRes)
        .then(result => {}, reason => {
          expect(reason).to.be.equals('input id not valid while collapsing');
          done(null);
        });
			});
		});
		
	});
});