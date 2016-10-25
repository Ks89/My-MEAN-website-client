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

var User;
var mongoose = require('mongoose');
require('../app_server/models/users');

mongoose.connect('mongodb://localhost/test-db');
User = mongoose.model('User');

var userDb;

var util = require('../app_server/utils/util');
var serviceNames = require('../app_server/controllers/authentication/serviceNames');

//add session property to the mocked
//request (used to store jwt session token by redis)
var mockedReq = {
	session : {
			authToken : null
	}
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

const profileMock = {
  id: 'id',
  displayName: NAME,
  username: USERNAME,
  name : {
    familyName : NAME,
    givenName : NAME
  },
  profileUrl: URL,
  emails: [ { value: EMAIL } ],
  provider: 'random value',
};

const USER_NOT_AN_OBJECT = "impossible to update because user must be an object";
const PROFILE_NOT_AN_OBJECT = "impossible to update because profile must be an object";
const MUST_BE_STRINGS = "impossible to update because both serviceName and accessToken must be strings";
const SERVICENAME_NOT_RECOGNIZED = "impossible to update because serviceName is not recognized";

describe('3dparty-passport', () => {

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

	function getUser(profileType) {
		var newUser = new User();
		//if profileType === 0 => don't add anything
		if(profileType !== 0) {
			addProfile(newUser, profileType);
		}
		return newUser;
	}

	// function insertUserTestDb(done) {
	// 	userDb = new User();
	// 	userDb.local.name = NAME;
	// 	userDb.local.email = EMAIL;
	// 	userDb.setPassword(PASSWORD);
	// 	userDb.save((err, usr) => {
	// 		if(err) {
	// 			done(err);
	// 		}
	// 		userDb._id = usr._id;
	// 		done(); //pass done, it's important!
	// 	});
	// }

	function dropUserCollectionTestDb(done) {
		User.remove({}, err => {
			done(err);
		});
	}

	describe('#authenticate()', () => {
		describe('---YES---', () => {
			beforeEach(done => dropUserCollectionTestDb(done));

			var whitelistServices = _und.without(serviceNames, 'profile', 'local');
			for(let i=0; i<whitelistServices.length; i++) {
				it('should authenticate for the first time (new user 3dparty service). Test i=' + i, done => {
					var authenticateFunct = thirdParty.__get__('authenticate');

					//callback fun ction used below
					var callbackResponse = function(err, response) {
						console.log(err);

						expect(response[whitelistServices[i]].token).to.be.equals(TOKEN);
						expect(response[whitelistServices[i]].id).to.be.equals('id');

						switch(whitelistServices[i]) {
					    case 'facebook':
					      expect(response[whitelistServices[i]].name).to.be.equals(NAME + ' ' + NAME);
					      expect(response[whitelistServices[i]].profileUrl).to.be.equals(URL);
					      expect(response[whitelistServices[i]].email).to.be.equals(EMAIL);
					      break;
					    case 'github':
					      expect(response[whitelistServices[i]].name).to.be.equals(NAME);
					      expect(response[whitelistServices[i]].username).to.be.equals(USERNAME);
					      expect(response[whitelistServices[i]].profileUrl).to.be.equals(URL);
					      expect(response[whitelistServices[i]].email).to.be.equals(EMAIL);
					      break;
					    case 'google':
					      expect(response[whitelistServices[i]].name).to.be.equals(NAME);
					      expect(response[whitelistServices[i]].email).to.be.equals(EMAIL);
					      break;
					    case 'linkedin':
					      expect(response[whitelistServices[i]].name).to.be.equals(NAME + ' ' + NAME);
					      expect(response[whitelistServices[i]].email).to.be.equals(EMAIL);
					      break;
					    case 'twitter':
					      expect(response[whitelistServices[i]].name).to.be.equals(NAME);
					      expect(response[whitelistServices[i]].username).to.be.equals(USERNAME);
					    	expect(response[whitelistServices[i]].email).to.be.equals(EMAIL);
					      break;
					  }
						done();
					};

					authenticateFunct(mockedReq, TOKEN, TOKEN, profileMock,
						callbackResponse, whitelistServices[i], User);
				});
			}

			it('should authenticate, but the user is existing and you are logged in.', done => {
				var authenticateFunct = thirdParty.__get__('authenticate');

				userDb = new User();

				addUserByServiceName(userDb, 'twitter');

				userDb.save((err, usr) => {
					if(err) {
						done(err);
					}

					console.log("user input saved on db");
					console.log(usr);

					//callback fun ction used below
					var callbackResponse = function(err, response) {
						console.log(err);
						expect(response.github.token).to.be.equals(TOKEN);
						expect(response.github.id).to.be.equals('id');
						expect(response.github.name).to.be.equals(NAME);
						expect(response.github.username).to.be.equals(USERNAME);
						expect(response.github.profileUrl).to.be.equals(URL);
						expect(response.github.email).to.be.equals(EMAIL);
						done();
					};

					mockedReq.user = usr; //already logged in

					authenticateFunct(mockedReq, TOKEN, TOKEN, profileMock,
						callbackResponse, 'github', User);
				});
			});

			it('should authenticate, but the user is NOT existing and you aren\'t logged in.', done => {
				var authenticateFunct = thirdParty.__get__('authenticate');

				userDb = new User();

				addUserByServiceName(userDb, 'twitter');

				userDb.save((err, usr) => {
					if(err) {
						done(err);
					}

					console.log("user input saved on db");
					console.log(usr);

					//callback fun ction used below
					var callbackResponse = function(err, response) {
						console.log(err);

						expect(response.github.token).to.be.equals(TOKEN);
						expect(response.github.id).to.be.equals('not already existing token');
						expect(response.github.name).to.be.equals(NAME);
						expect(response.github.username).to.be.equals(USERNAME);
						expect(response.github.profileUrl).to.be.equals(URL);
						expect(response.github.email).to.be.equals(EMAIL);
						done();
					};

					mockedReq.user = null;
					let profileMockModified = _und.clone(profileMock);
					profileMockModified.id = 'not already existing token';

					authenticateFunct(mockedReq, TOKEN, TOKEN, profileMockModified,
						callbackResponse, 'github', User);
				});
			});

			it('should authenticate, but the user exists and you aren\'t logged in.', done => {
				var authenticateFunct = thirdParty.__get__('authenticate');

				userDb = new User();

				addUserByServiceName(userDb, 'github');
				userDb.github.token = null;

				userDb.save((err, usr) => {
					if(err) {
						done(err);
					}

					console.log("user input saved on db");
					console.log(usr);

					//callback fun ction used below
					var callbackResponse = function(err, response) {
						console.log(err);
						expect(response.github.token).to.be.equals(TOKEN);
						expect(response.github.id).to.be.equals(profileMockModified.id);
						expect(response.github.name).to.be.equals(NAME);
						expect(response.github.username).to.be.equals(USERNAME);
						expect(response.github.profileUrl).to.be.equals(URL);
						expect(response.github.email).to.be.equals(EMAIL);
						done();
					};

					mockedReq.user = null;
					let profileMockModified = _und.clone(profileMock);
					profileMockModified.id = 'github' + ID_POSTFIX;

					authenticateFunct(mockedReq, TOKEN, TOKEN, profileMockModified,
						callbackResponse, 'github', User);
				});
			});

			it('should authenticate, but there is a local user already logged in.', done => {
				var authenticateFunct = thirdParty.__get__('authenticate');
				userDb = new User();
				addUserByServiceName(userDb, 'local');

				userDb.save((err, usr) => {
					if(err) {
						done(err);
					}

					//callback fun ction used below
					var callbackResponse = function(err, response) {
						console.log(err);
						expect(response.github.token).to.be.equals(TOKEN);
						expect(response.github.id).to.be.equals('id');
						expect(response.github.name).to.be.equals(NAME);
						expect(response.github.username).to.be.equals(USERNAME);
						expect(response.github.profileUrl).to.be.equals(URL);
						expect(response.github.email).to.be.equals(EMAIL);
						done();
					};

					mockedReq.session.localUserId = usr._id;

					authenticateFunct(mockedReq, TOKEN, TOKEN, profileMock,
						callbackResponse, 'github', User);
				});
			});

		});

		describe('---NO/ERRORS---', () => {
			it('should not authenticate, because the local user id isn\'t existing.', done => {
				var authenticateFunct = thirdParty.__get__('authenticate');
				userDb = new User();
				addUserByServiceName(userDb, 'local');

				userDb.save((err, usr) => {
					if(err) {
						done(err);
					}

					//callback function used below
					var callbackResponse = function(err, response) {
						expect(err).to.be.equals('Impossible to find an user with sessionLocalUserId');
						done();
					};

					var ObjectID = require('mongodb').ObjectID;
					// Create a new ObjectID using the createFromHexString function
					var objectID = new ObjectID.createFromHexString('123456789012345678901234');
					mockedReq.session.localUserId = objectID;

					authenticateFunct(mockedReq, TOKEN, TOKEN, profileMock,
						callbackResponse, 'github', User);
				});
			});

			const mockedWrongLocalUserId = [
				-2, -1, -0, 0, 1, 2, function(){}, ()=>{}, /fooRegex/i, [],
				new Error(), new RegExp(/fooRegex/,'i'), new RegExp('/fooRegex/','i'),
				new Date(), new Array(), true, false
			];

			for(let i=0; i<mockedWrongLocalUserId.length; i++) {
				it('should not authenticate, because the local user id isn\'t valid. Test i=' + i, done => {
					var authenticateFunct = thirdParty.__get__('authenticate');
					userDb = new User();
					addUserByServiceName(userDb, 'local');

					userDb.save((err, usr) => {
						if(err) {
							done(err);
						}

						//callback function used below
						var callbackResponse = function(err, response) {
							expect(err).to.be.equals('sessionLocalUserId must be either a string, null, undefined or an ObjectId');
							done();
						};

						mockedReq.session.localUserId = mockedWrongLocalUserId[i];

						authenticateFunct(mockedReq, TOKEN, TOKEN, profileMock,
							callbackResponse, 'github', User);
					});
				});
			}


			const mockedNotFoundLocalUserId = [
				"123456789012345678901234",
				(new require('mongodb').ObjectID).createFromHexString('123456789012345678901234')
				//nb: if you pass null or undefined it's like if you aren\'t logged in as local user
			];

			for(let i=0; i<mockedNotFoundLocalUserId.length; i++) {
				it('should not authenticate, because the local user id isn\'t inside the db. Test i=' + i, done => {
					var authenticateFunct = thirdParty.__get__('authenticate');
					userDb = new User();
					addUserByServiceName(userDb, 'local');

					userDb.save((err, usr) => {
						if(err) {
							done(err);
						}

						//callback function used below
						var callbackResponse = function(err, response) {
							expect(err).to.be.equals('Impossible to find an user with sessionLocalUserId');
							done();
						};

						mockedReq.session.localUserId = mockedNotFoundLocalUserId[i];

						authenticateFunct(mockedReq, TOKEN, TOKEN, profileMock,
							callbackResponse, 'github', User);
					});
				});
			}

			const mockedWrongDataLocal = [
				{token: null, profile: profileMock, serviceName: 'github', exception: 'impossible to update because both serviceName and accessToken must be strings'},
				{token: TOKEN, profile: profileMock, serviceName: null, exception: 'impossible to update because both serviceName and accessToken must be strings'},
				{token: null, profile: profileMock, serviceName: null, exception: 'impossible to update because both serviceName and accessToken must be strings'},
				{token: TOKEN, profile: null, serviceName: 'github', exception: 'impossible to update because profile must be an objects'},
				{token: TOKEN, profile: profileMock, serviceName: 'wrong_serviceName', exception: 'impossible to update because serviceName is not recognized'}
			];

			for(let i=0; i<mockedWrongDataLocal.length; i++) {
				it('should not authenticate (previously logged as local user), because there is an error in updateUser. Test i=' + i, done => {
					var authenticateFunct = thirdParty.__get__('authenticate');
					userDb = new User();
					addUserByServiceName(userDb, 'local');

					userDb.save((err, usr) => {
						if(err) {
							done(err);
						}

						//callback function used below
						var callbackResponse = function(err, response) {
							expect(err).to.be.equals(mockedWrongDataLocal[i].exception);
							done();
						};

						mockedReq.session.localUserId = usr._id;

						authenticateFunct(mockedReq, mockedWrongDataLocal[i].token, TOKEN,
							mockedWrongDataLocal[i].profile, callbackResponse, mockedWrongDataLocal[i].serviceName, User);
					});
				});
			}

			const mockedWrongData3dparty = [
				{token: null, profile: profileMock, serviceName: 'github', exception: 'impossible to update because both serviceName and accessToken must be strings'},
				{token: TOKEN, profile: profileMock, serviceName: null, exception: 'impossible to update because both serviceName and accessToken must be strings'},
				{token: null, profile: profileMock, serviceName: null, exception: 'impossible to update because both serviceName and accessToken must be strings'},
				{token: TOKEN, profile: null, serviceName: 'github', exception: 'impossible to update because profile must be an objects'},
				{token: TOKEN, profile: profileMock, serviceName: 'wrong_serviceName', exception: 'impossible to update because serviceName is not recognized'}
			];

			for(let i=0; i<mockedWrongData3dparty.length; i++) {
				it('should not authenticate (previously logged as 3dparty user), because there is an error in updateUser. Test i=' + i, done => {
					var authenticateFunct = thirdParty.__get__('authenticate');
					userDb = new User();
					addUserByServiceName(userDb, 'twitter');

					userDb.save((err, usr) => {
						if(err) {
							done(err);
						}

						//callback fun ction used below
						var callbackResponse = function(err, response) {
							expect(err).to.be.equals(mockedWrongData3dparty[i].exception);
							done();
						};

						mockedReq.session.localUserId = usr._id;

						authenticateFunct(mockedReq, mockedWrongData3dparty[i].token, TOKEN,
							mockedWrongData3dparty[i].profile, callbackResponse, mockedWrongData3dparty[i].serviceName, User);
					});
				});
			}

			const mockedWrongData3dpartyNew = [
				{token: null, profile: profileMock, serviceName: 'github', exception: 'impossible to update because both serviceName and accessToken must be strings'},
				{token: TOKEN, profile: profileMock, serviceName: null, exception: 'impossible to update because both serviceName and accessToken must be strings'},
				{token: null, profile: profileMock, serviceName: null, exception: 'impossible to update because both serviceName and accessToken must be strings'},
				{token: TOKEN, profile: profileMock, serviceName: 'wrong_serviceName', exception: 'impossible to update because serviceName is not recognized'}
			];

			// TODO FIXME broken for some reasons only when I run `gulp test` and not simply
			// running `mocha test-server-unit/3dparty-passport-test.js`
			// for(let i=0; i<mockedWrongData3dpartyNew.length; i++) {
			// 	it('should not authenticate (NOT previously logged), because there is an error in updateUser. Test i=' + i, done => {
			// 		var authenticateFunct = thirdParty.__get__('authenticate');
			//
			// 		userDb = new User();
			// 		addUserByServiceName(userDb, 'twitter');
			//
			// 		userDb.save((err, usr) => {
			// 			if(err) {
			// 				done(err);
			// 			}
			//
			// 			//callback fun ction used below
			// 			var callbackResponse = function(err, response) {
			// 				expect(err).to.be.equals(mockedWrongData3dpartyNew[i].exception);
			// 				done();
			// 			};
			//
			// 			mockedReq.user = null;
			// 			let profileMockModified = _und.clone(mockedWrongData3dpartyNew[i].profile);
			// 			profileMockModified.id = 'not already existing token';
			//
			// 			authenticateFunct(mockedReq, mockedWrongData3dpartyNew[i].token, TOKEN,
			// 				mockedWrongData3dpartyNew[i].profile, callbackResponse, mockedWrongData3dpartyNew[i].serviceName, User);
			// 		});
			// 	});
			// }

		});
	})

	describe('#updateUser()', () => {
		describe('---YES---', () => {

			beforeEach(() => User.remove({}, err => err));

			it('should update an empty object with profile infos after the 3dparty login.', done => {
        // Overwrite the private a1 function with the mock.
        var updateFunct = thirdParty.__get__('updateUser');

        let userGithub = updateFunct(getUser(1), TOKEN, profileMock, 'github');
				let userGoogle = updateFunct(getUser(1), TOKEN, profileMock, 'google');
        let userFacebook = updateFunct(getUser(1), TOKEN, profileMock, 'facebook');
        let userTwitter = updateFunct(getUser(1), TOKEN, profileMock, 'twitter');
        let userLinkedin = updateFunct(getUser(1), TOKEN, profileMock, 'linkedin');

        expect(userGithub.github.email).to.be.equals(EMAIL);
        expect(userGithub.github.profileUrl).to.be.equals(URL);
        expect(userGithub.github.username).to.be.equals(USERNAME);
        expect(userGithub.github.name).to.be.equals(NAME);
        expect(userGithub.github.token).to.be.equals(TOKEN);
        expect(userGithub.github.id).to.be.equals('id');

        expect(userGoogle.google.email).to.be.equals(EMAIL);
        expect(userGoogle.google.name).to.be.equals(NAME);
        expect(userGoogle.google.token).to.be.equals(TOKEN);
        expect(userGoogle.google.id).to.be.equals('id');

        expect(userFacebook.facebook.email).to.be.equals(EMAIL);
        expect(userFacebook.facebook.profileUrl).to.be.equals(URL);
        expect(userFacebook.facebook.name).to.be.equals(NAME + ' ' + NAME);
        expect(userFacebook.facebook.token).to.be.equals(TOKEN);
        expect(userFacebook.facebook.id).to.be.equals('id');

        expect(userTwitter.twitter.email).to.be.equals(EMAIL);
        expect(userTwitter.twitter.username).to.be.equals(USERNAME);
        expect(userTwitter.twitter.name).to.be.equals(NAME);
        expect(userTwitter.twitter.token).to.be.equals(TOKEN);
        expect(userTwitter.twitter.id).to.be.equals('id');

        expect(userLinkedin.linkedin.email).to.be.equals(EMAIL);
        expect(userLinkedin.linkedin.name).to.be.equals(NAME + ' ' + NAME);
        expect(userLinkedin.linkedin.token).to.be.equals(TOKEN);
        expect(userLinkedin.linkedin.id).to.be.equals('id');

        done();
			});

      it('should update an empty object with twitter profile without email after the 3dparty login.', done => {
        // Overwrite the private a1 function with the mock.
        var updateFunct = thirdParty.__get__('updateUser');
        //remove profileMock's email
        profileMock.emails = undefined;

        let userTwitter = updateFunct(getUser(0), TOKEN, profileMock, 'twitter');

        expect(userTwitter.twitter.email).to.be.undefined;
        expect(userTwitter.twitter.username).to.be.equals(USERNAME);
        expect(userTwitter.twitter.name).to.be.equals(NAME);
        expect(userTwitter.twitter.token).to.be.equals(TOKEN);
        expect(userTwitter.twitter.id).to.be.equals('id');

        done();
			});
		});

    describe('---ERRORS---', () => {
      var updateFunct = thirdParty.__get__('updateUser')

			it('should catch an exception, because user must be an object.', done => {
        expect(()=>updateFunct("", TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(-2, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(-1, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(-0, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(0, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(1, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(2, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(null, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(undefined, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(function(){}, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(()=>{}, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(/fooRegex/i, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct([], TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(new Error(), TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(new RegExp(/fooRegex/,'i'), TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(new RegExp('/fooRegex/','i'), TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(new Date(), TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(new Array(), TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(true, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
				expect(()=>updateFunct(false, TOKEN, profileMock, 'any_string')).to.throw(USER_NOT_AN_OBJECT);
        done();
			});

      it('should catch an exception, because profile must be an object.', done => {
        expect(()=>updateFunct(getUser(0), TOKEN, "", 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, -2, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, -1, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, -0, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, 0, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, 1, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, 2, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, null, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, undefined, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, function(){}, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, ()=>{}, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, /fooRegex/i, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, [], 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, new Error(), 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, new RegExp(/fooRegex/,'i'), 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, new RegExp('/fooRegex/','i'), 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, new Date(), 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, new Array(), 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, true, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
				expect(()=>updateFunct(getUser(0), TOKEN, false, 'any_string')).to.throw(PROFILE_NOT_AN_OBJECT);
        done();
			});

      it('should catch an exception, because both accessToken and serviceName must be strings.', done => {
        expect(()=>updateFunct(getUser(0), null, profileMock, 'any_string')).to.throw(MUST_BE_STRINGS);
        expect(()=>updateFunct(getUser(0), 'any_string', profileMock, null)).to.throw(MUST_BE_STRINGS);

				expect(()=>updateFunct(getUser(0), -2, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), -1, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), -0, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), 0, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), 1, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), 2, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), null, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), undefined, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), function(){}, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), ()=>{}, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), /fooRegex/i, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), [], profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), new Error(), profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), new RegExp(/fooRegex/,'i'), profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), new RegExp('/fooRegex/','i'), profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), new Date(), profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), new Array(), profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), true, profileMock, null)).to.throw(MUST_BE_STRINGS);
				expect(()=>updateFunct(getUser(0), false, profileMock, null)).to.throw(MUST_BE_STRINGS);
        done();
      });

      it('should catch an exception, because serviceName isn\'t recogized.', done => {
        expect(()=>updateFunct(getUser(0), TOKEN, profileMock, 'fake_not_recognized')).to.throw(SERVICENAME_NOT_RECOGNIZED);
        done();
      });
		});
	});
});

after(() => User.remove({}, err => err));
