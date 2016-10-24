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

var jwt = require('jsonwebtoken');
var collapser = require('../app_server/controllers/authentication/common/auth-experimental-collapse-db');

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

describe('auth-experimental-collapse-db', () => {

	describe('#collapseDb()', () => {

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

		//alreadyOnDb is an account previously created on db,
		//inputCollapse is the current account used to login.
		//0: no profile, 1: profile with '1' in string fields, 2: profile with '2' in string fields
		const inputAndOutputMocked = [
			// collapse between two users with two accounts each one (also with profiles)
			{alreadyOnDb:getUser(['local','github'],1), inputCollapse:getUser(['github','google'],0), service:'github'},
			{alreadyOnDb:getUser(['local','google'],1), inputCollapse:getUser(['facebook','google'],0), service:'google'},
			{alreadyOnDb:getUser(['local','facebook'],0), inputCollapse:getUser(['local','google'],2), service:'local'},
			{alreadyOnDb:getUser(['local','twitter'],1), inputCollapse:getUser(['twitter','github'],0), service:'twitter'},
			{alreadyOnDb:getUser(['local','linkedin'],1), inputCollapse:getUser(['local','facebook'],2), service:'local'},
			{alreadyOnDb:getUser(['facebook','github'],1), inputCollapse:getUser(['local','github'],2), service:'github'},
			{alreadyOnDb:getUser(['facebook','google'],1), inputCollapse:getUser(['facebook','local'],2), service:'facebook'},
			{alreadyOnDb:getUser(['facebook','twitter'],1), inputCollapse:getUser(['google','twitter'],2), service:'twitter'},
			{alreadyOnDb:getUser(['facebook','linkedin'],0), inputCollapse:getUser(['facebook','github'],0), service:'facebook'},
			{alreadyOnDb:getUser(['google','github'],0), inputCollapse:getUser(['github','facebook'],0), service:'github'},
			{alreadyOnDb:getUser(['google','twitter'],1), inputCollapse:getUser(['github','google'],0), service:'google'},
			{alreadyOnDb:getUser(['google','linkedin'],1), inputCollapse:getUser(['linkedin','twitter'],2), service:'linkedin'},
			{alreadyOnDb:getUser(['github','twitter'],1), inputCollapse:getUser(['github','google'],2), service:'github'},
			{alreadyOnDb:getUser(['github','linkedin'],0), inputCollapse:getUser(['linkedin','local'],2), service:'linkedin'},
			{alreadyOnDb:getUser(['twitter','linkedin'],1), inputCollapse:getUser(['local','twitter'],0), service:'twitter'},

			// collapse between two users with three accounts each one
			{alreadyOnDb:getUser(['local','github', 'facebook'],1), inputCollapse:getUser(['github','google', 'twitter'],0), service:'github'},
			{alreadyOnDb:getUser(['local','google', 'twitter'],1), inputCollapse:getUser(['facebook','google', 'linkedin'],0), service:'google'},
			{alreadyOnDb:getUser(['local','facebook', 'linkedin'],0), inputCollapse:getUser(['local','google', 'github'],2), service:'local'},
			{alreadyOnDb:getUser(['local','facebook', 'linkedin'],1), inputCollapse:getUser(['local','google', 'github'],2), service:'local'},

			// multiple-collapse between two users with three or more accounts each one (because these two users have two services in common )
			// this test should pass as the previous cases
			{alreadyOnDb:getUser(['linkedin','google', 'twitter'],1), inputCollapse:getUser(['facebook','github', 'linkedin', 'local'],0), service:'linkedin'}
	];

		describe('---YES---', () => {

			beforeEach(() => User.remove({}, err => err));

			for(let i=0; i<inputAndOutputMocked.length; i++) {
				it('should collapse the db and check that users has been merged. Test i=' + i + ', common service=' + inputAndOutputMocked[i].service, done => {
					var tempAlreadyOnDbUser = inputAndOutputMocked[i].alreadyOnDb;
					var tempInputCollapse = inputAndOutputMocked[i].inputCollapse;
					var service = inputAndOutputMocked[i].service;

					inputAndOutputMocked[i].alreadyOnDb.save((err, onDbUser) => {
						if(err) done(err);

						inputAndOutputMocked[i].inputCollapse.save((err, inputCollapseUser) => {
							if(err) done(err);

							collapser.collapseDb(tempInputCollapse, service, mockedReq)
		          .then(result => {
								if(!result) done("result is null");
		            console.log("collapseDb localuser with 3dpartyauth promise");
		            console.log(result);

		            console.log("----------------alreadyOnDb---------------");
		            console.log(tempAlreadyOnDbUser);
		            console.log("----------------inputCollapseUser---------------");
		            console.log(tempInputCollapse);
		            console.log("----------------COLLAPSE RESULT---------------");
		            console.log(result);

								//iterate over an array of two objects built on the fly with alreadyOnDbUser and inputCollapseUser
								for(let tempObjUser of [tempAlreadyOnDbUser,tempInputCollapse]) {
									//Iterate over the properties of the object
									for(let tempObjServiceName in tempObjUser) {
										//if the property is recognized (found inside serviceNames array) go ahead
										if(serviceNames.indexOf(tempObjServiceName) !== -1 &&
											tempObjUser[tempObjServiceName] !== undefined &&
											(tempObjUser[tempObjServiceName]['name'] !== undefined
												|| tempObjUser[tempObjServiceName]['id'] !== undefined)) {
											console.log("§§§§§§§§§§§§§§§§§§§§§§§§§ " + tempObjServiceName);

											//I store in two constants these two objects
											//The first one is the result object (not the entire user,
											// but only the user retrieved by the serviceName) with the collapsed data.
											//The last one is one of the original users used by the collapse procedure.
											var resultUserSN = result[tempObjServiceName];
											var originalUserSN = tempObjUser[tempObjServiceName];

											//il check if the result's properties are equal to the object, before the collapse procedure
											if(tempObjServiceName === 'local') {
												console.log(originalUserSN);
												console.log(resultUserSN);
												expect(resultUserSN.email).to.be.not.undefined;
												expect(resultUserSN.name).to.be.not.undefined;
												expect(resultUserSN.hash).to.be.not.undefined;
												expect(resultUserSN.email).to.be.equal(originalUserSN.email);
												expect(resultUserSN.name).to.be.equal(originalUserSN.name);
												expect(originalUserSN.hash).to.be.not.undefined;
												// expect(tempObjUser.validPassword(PASSWORD)).to.be.true;
												// expect(result.validPassword(PASSWORD)).to.be.true;
											} else if(tempObjServiceName !== 'profile') {
												expect(resultUserSN.id).to.be.not.undefined;
												expect(resultUserSN.token).to.be.not.undefined;
												expect(resultUserSN.email).to.be.not.undefined;
												expect(resultUserSN.name).to.be.not.undefined;
												expect(resultUserSN.id).to.be.equal(originalUserSN.id);
												expect(resultUserSN.token).to.be.equal(originalUserSN.token);
												expect(resultUserSN.email).to.be.equal(originalUserSN.email);
												expect(resultUserSN.name).to.be.equal(originalUserSN.name);
												switch(tempObjServiceName) {
													case 'facebook':
														expect(resultUserSN.profileUrl).to.be.not.undefined;
														expect(resultUserSN.profileUrl).to.be.equal(originalUserSN.profileUrl);
														break;
													case 'github':
														expect(resultUserSN.username).to.be.not.undefined;
														expect(resultUserSN.profileUrl).to.be.not.undefined;
														expect(resultUserSN.username).to.be.equal(originalUserSN.username);
														expect(resultUserSN.profileUrl).to.be.equal(originalUserSN.profileUrl);
														break;
													case 'twitter':
														expect(resultUserSN.username).to.be.not.undefined;
														expect(resultUserSN.username).to.be.equal(originalUserSN.username);
														break;
												}
											} else if(tempObjServiceName === 'profile') {
												if(resultUserSN !== null && resultUserSN !== undefined) {
														console.log(resultUserSN);

														if(originalUserSN !== null && originalUserSN !== undefined) {
																console.log(originalUserSN);

																if(originalUserSN.name!==resultUserSN.name) {
																	if(originalUserSN.name===PROFILENAME1) {
																		expect(resultUserSN.name).to.be.equal(PROFILENAME2);
															      expect(resultUserSN.surname).to.be.equal(PROFILESURNAME2);
															      expect(resultUserSN.nickname).to.be.equal(PROFILENICKNAME2);
															      expect(resultUserSN.email).to.be.equal(PROFILEEMAIL2);
															      //expect(resultUserSN.updated).to.be.equal(PROFILEDATE);
															      expect(resultUserSN.visible).to.be.equal(PROFILEVISIBLE2);
																	} else {
																		expect(resultUserSN.name).to.be.equal(PROFILENAME1);
															      expect(resultUserSN.surname).to.be.equal(PROFILESURNAME1);
															      expect(resultUserSN.nickname).to.be.equal(PROFILENICKNAME1);
															      expect(resultUserSN.email).to.be.equal(PROFILEEMAIL1);
															      //expect(resultUserSN.updated).to.be.equal(PROFILEDATE);
															      expect(resultUserSN.visible).to.be.equal(PROFILEVISIBLE1);
																	}
																} else {
																	expect(resultUserSN.name).to.be.equal(originalUserSN.name);
														      expect(resultUserSN.surname).to.be.equal(originalUserSN.surname);
														      expect(resultUserSN.nickname).to.be.equal(originalUserSN.nickname);
														      expect(resultUserSN.email).to.be.equal(originalUserSN.email);
														      //expect(resultUserSN.updated).to.be.equal(originalUserSN.);
														      expect(resultUserSN.visible).to.be.equal(originalUserSN.visible);
																}
														}
												}
											}
										}
									}
								}
								done();
		          }, reason => {
		            console.log("ERROR collapseDb localuser with 3dpartyauth promise");
								done("error while calling collapseDb");
		          });
	          });
					});
				});
			}
		});

		describe('---ERRORS---', () => {

			const serviceNameWrongMock = [undefined, null, -1, 5, 99, 600,
					function(){}, ()=>{}, /fooRegex/i, [], new RegExp(/fooRegex/,'i'),
					new RegExp('/fooRegex/','i'), new Error(), true, false, new Array()];

			for(let i=0; i<serviceNameWrongMock.length; i++) {
				it('should catch an error, because you must pass a serviceName as parameter. Test i=' + i, done => {
					collapser.collapseDb({}, serviceNameWrongMock[i], mockedReq)
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
					collapser.collapseDb({}, serviceNameUnrecognizedMock[i], mockedReq)
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
					collapser.collapseDb(loggedUserWrongMock[i], 'local', mockedReq)
          .then(result => {}, reason => {
            expect(reason).to.be.equals('impossible to collapseDb because loggedUser is not an object');
            done(null);
          });
				});
			}

			const loggedUserIdNotValidMock = [
				{user: {local: {}}, serviceName: 'github'},
				{user: {github: {}}, serviceName: 'local'},
				{user: {github: null}, serviceName: 'github'},
				{user: {github: undefined}, serviceName: 'github'},
				{user: {local: null}, serviceName: 'github'},
				{user: {github: undefined}, serviceName: 'local'},
				{user: {local: { email: NAME}}, serviceName: 'github'},
				{user: {github: { id: 'id'}}, serviceName: 'local'},
				{user: {local: { id: 'id'}}, serviceName: 'local'},
				{user: {local: { username: NAME}}, serviceName: 'local'},
				{user: {local: { token: TOKEN}}, serviceName: 'local'},
				{user: {google: { email: EMAIL}}, serviceName: 'google'},
				{user: {google: { hash: PASSWORD}}, serviceName: 'google'},
				{user: {google: { name: NAME}}, serviceName: 'google'},
				{user: {local: { email: NAME}, profile:{name: PROFILENAME1}}, serviceName: 'github'},
				{user: {github: { id: 'id'}, profile:{name: PROFILENAME1}}, serviceName: 'local'},
				{user: {local: { id: 'id'}, profile:{name: PROFILENAME1}}, serviceName: 'local'},
				{user: {local: { username: NAME}, profile:{name: PROFILENAME1}}, serviceName: 'local'},
				{user: {local: { token: TOKEN}, profile:{name: PROFILENAME1}}, serviceName: 'local'},
				{user: {google: { email: EMAIL}, profile:{name: PROFILENAME1}}, serviceName: 'google'},
				{user: {google: { hash: PASSWORD}, profile:{name: PROFILENAME1}}, serviceName: 'google'},
				{user: {google: { name: NAME}, profile:{name: PROFILENAME1}}, serviceName: 'google'},
				{user: {github: { id: 'id'}, profile:{name: PROFILENAME1}}, serviceName: 'local'},
				{user: {google: { email: EMAIL}, github: { hash: PASSWORD}, profile:{name: PROFILENAME1}}, serviceName: 'google'},
				{user: {google: { hash: PASSWORD}, facebook: { name: NAME}, profile:{name: PROFILENAME1}}, serviceName: 'google'},
				{user: {google: { name: NAME}, twitter: { email: EMAIL},profile:{name: PROFILENAME1}}, serviceName: 'google'}
			];

			for(let i=0; i<loggedUserIdNotValidMock.length; i++) {
				it('should catch an error, because logged user hasn\'t an id/email for the specified serviceName. Test i=' + i, done => {
					collapser.collapseDb(loggedUserIdNotValidMock[i].user, loggedUserIdNotValidMock[i].serviceName, mockedReq)
	        .then(result => {}, reason => {
	          expect(reason).to.be.equals('input id not valid while collapsing');
	          done();
	        });
				});
			}


			it('should catch an error, because there isn\'t a duplicated user', done => {
				var alreadyOnDbUser = getUser(['local','github'],1);
				var loggingInUser = getUser(['facebook','google'],0);

				User.remove({}, err => {
					alreadyOnDbUser.save((err, onDbUser) => {
						if(err) done(err);
						loggingInUser.save((err, onDbUser) => {
							if(err) done(err);
							collapser.collapseDb(loggingInUser, 'facebook', mockedReq)
							.then(result => done('error'), reason => {
								expect(reason).to.be.equals('No duplicated user found while collapsing');
								done();
							});
						});
					});
				});
			});
		});
	});
});

after(() => User.remove({}, err => err));
