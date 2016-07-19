'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

//to be able to use generateJwt I must import
//dotenv (otherwise I cannot read process.env with the encryption key)
require('dotenv').config();

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var _und = require('underscore');
var rewire = require('rewire');
var sinon = require('sinon');

var User;
var mongoose = require('mongoose');
require('../app_server/models/users');

mongoose.connect('mongodb://localhost/test-db');
User = mongoose.model('User');

var userDb;

var util = require('../app_server/utils/util');
var serviceNames = require('../app_server/controllers/authentication/serviceNames');

var MockedRes = require('./mocked-res-class');
var mockedRes = new MockedRes();
//add session property to the mocked object
mockedRes.session = {
	authToken : null
};

//rewire to call functions using _get_
var thirdParty = rewire('../app_server/controllers/authentication/3dparty/3dparty-passport');

const USERNAME = 'username';
const EMAIL = 'email@email.it';
const PASSWORD = 'Password1';
const TOKEN = 'random_fake_token';
const ID_POSTFIX = ' id';
const NAME = 'name';
const URL = 'http//fakeprofileurl.com/myprofile';
const PROFILENAME1 = 'name 1';
const PROFILESURNAME1 = 'surname 1';
const PROFILENICKNAME1 = 'nickname 1';
const PROFILEEMAIL1 = 'email 1';
const PROFILEVISIBLE1 = true;
const PROFILENAME2 = 'name 2';
const PROFILESURNAME2 = 'surname 2';
const PROFILENICKNAME2 = 'nickname 2';
const PROFILEEMAIL2 = 'email 2';
const PROFILEVISIBLE2 = true;
const PROFILEDATE = new Date();

describe('3dparty-passport', () => {

	describe('#updateUser()', () => {

		function addLocalUser(newUser) {
			newUser.local = {
					name : USERNAME,
					email : EMAIL,
					hash : PASSWORD
			};
			//newUser.setPassword(PASSWORD);
		}

		function addUserByServiceName(newUser, serviceName) {
			newUser[serviceName].id = serviceName + ID_POSTFIX;
	    newUser[serviceName].token = TOKEN;
	    newUser[serviceName].email = EMAIL;
	    newUser[serviceName].name  = NAME;
	    // other cases
	    switch(serviceName) {
	      case 'facebook':
	        newUser[serviceName].profileUrl = URL;
					break;
	      case 'github':
	        newUser[serviceName].username = USERNAME;
	        newUser[serviceName].profileUrl = URL;
					break;
	      case 'twitter':
	        newUser[serviceName].username  = USERNAME;
					break;
	    }
		}

		function addProfile(newUser, profileType) {
			//if profileType === 0 => don't add anything
			if(profileType === 1) {
				newUser.profile = {
					name : PROFILENAME1,
					surname : PROFILESURNAME1,
					nickname : PROFILENICKNAME1,
					email : PROFILEEMAIL1,
					updated : PROFILEDATE,
					visible : PROFILEVISIBLE1
				};
			} else if(profileType === 2) {
				newUser.profile = {
					name : PROFILENAME2,
					surname : PROFILESURNAME2,
					nickname : PROFILENICKNAME2,
					email : PROFILEEMAIL2,
					updated : PROFILEDATE,
					visible : PROFILEVISIBLE2
				};
			}
		}

		function getUser(serviceNames, profileType) {
			var newUser = new User();
			//if profileType === 0 => don't add anything
			if(profileType !== 0) {
				addProfile(newUser, profileType);
			}
			for(let serviceName of serviceNames) {
				if(serviceName === 'local') {
					addLocalUser(newUser);
				} else {
					addUserByServiceName(newUser, serviceName);
				}
			}
			return newUser;
		}

		describe('---YES---', () => {

			beforeEach(done => User.remove({}, err => done(err)));

			it('should update an empty object with profile infos after the 3dparty login.', done => {
        	const profileMock = {
  					id: 'id',
  					displayName: NAME,
  					username: USERNAME,
            name : NAME,
            givenName : NAME,
  					profileUrl: URL,
  					emails: [ { value: EMAIL } ],
  					provider: 'random value',
  				};

        // Overwrite the private a1 function with the mock.
        var updateFunct = thirdParty.__get__('updateUser');

        let userGithub = updateFunct(getUser([], 0), TOKEN, profileMock, 'github');
        let userGoogle = updateFunct(getUser([], 0), TOKEN, profileMock, 'google');
        let userFacebook = updateFunct(getUser([], 0), TOKEN, profileMock, 'facebook');
        let userTwitter = updateFunct(getUser([], 0), TOKEN, profileMock, 'twitter');
        let userLinkedin = updateFunct(getUser([], 0), TOKEN, profileMock, 'linkedin');

        console.log(userGithub);
        console.log(userGoogle);
        console.log(userFacebook);
        console.log(userTwitter);
        console.log(userLinkedin);


        done();
			});
		});
	});
});

after(done => User.remove({}, err => done(err)));
