'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

//to be able to use generateJwt I must import
//dotenv (otherwise I cannot read process.env with the encryption key)
require('dotenv').config();

var chai = require('chai');
var chaiDeepMatch = require('chai-deep-match');
chai.use( chaiDeepMatch );
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
	// mongoose.connect('mongodb://localhost/test-db');
	// User = mongoose.model('User');
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
			newUser[serviceName].id = serviceName + ' id';
	    newUser[serviceName].token = 'random_fake_token';
	    newUser[serviceName].email = EMAIL;
	    newUser[serviceName].name  = 'name';
	    // other cases
	    switch(serviceName) {
	      case 'facebook':
	        newUser[serviceName].profileUrl = 'http//fakeprofileurl.com/myprofile';
					break;
	      case 'github':
	        newUser[serviceName].username = USERNAME;
	        newUser[serviceName].profileUrl = 'http//fakeprofileurl.com/myprofile';
					break;
	      case 'twitter':
	        newUser[serviceName].username  = USERNAME;
					break;
	    }
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

		function getUser(serviceNames, isAddProfile) {
			var newUser = new User();
			if(isAddProfile === true) {
				addProfile(newUser);
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
		const inputAndOutputMocked = [
			{alreadyOnDb:getUser(['local','github'],true), inputCollapse:getUser(['github','google'],false), service:'github'},
			{alreadyOnDb:getUser(['local','google'],true), inputCollapse:getUser(['facebook','google'],false), service:'google'},
			{alreadyOnDb:getUser(['local','facebook'],false), inputCollapse:getUser(['local','google'],true), service:'local'},
			{alreadyOnDb:getUser(['local','twitter'],true), inputCollapse:getUser(['twitter','github'],false), service:'twitter'},
			{alreadyOnDb:getUser(['local','linkedin'],true), inputCollapse:getUser(['local','facebook'],true), service:'local'},
			{alreadyOnDb:getUser(['facebook','github'],true), inputCollapse:getUser(['local','github'],true), service:'github'},
			{alreadyOnDb:getUser(['facebook','google'],true), inputCollapse:getUser(['facebook','local'],true), service:'facebook'},
			{alreadyOnDb:getUser(['facebook','twitter'],true), inputCollapse:getUser(['google','twitter'],true), service:'twitter'},
			{alreadyOnDb:getUser(['facebook','linkedin'],false), inputCollapse:getUser(['facebook','github'],false), service:'facebook'},
			{alreadyOnDb:getUser(['google','github'],false), inputCollapse:getUser(['github','facebook'],false), service:'github'},
			{alreadyOnDb:getUser(['google','twitter'],true), inputCollapse:getUser(['github','google'],false), service:'google'},
			{alreadyOnDb:getUser(['google','linkedin'],true), inputCollapse:getUser(['linkedin','twitter'],true), service:'linkedin'},
			{alreadyOnDb:getUser(['github','twitter'],true), inputCollapse:getUser(['github','google'],true), service:'github'},
			{alreadyOnDb:getUser(['github','linkedin'],false), inputCollapse:getUser(['linkedin','local'],true), service:'linkedin'},
			{alreadyOnDb:getUser(['twitter','linkedin'],true), inputCollapse:getUser(['local','twitter'],false), service:'twitter'}
	];

		describe('---YES---', () => {

			beforeEach(done => User.remove({}, err => done(err)));

			for(let i=0; i<inputAndOutputMocked.length; i++) {
				it('should collapse the db and check that users has been merged. Test i=' + i + ', common service=' + inputAndOutputMocked[i].service, done => {
					var tempAlreadyOnDbUser = inputAndOutputMocked[i].alreadyOnDb;
					var tempInputCollapse = inputAndOutputMocked[i].inputCollapse;
					var service = inputAndOutputMocked[i].service;

					inputAndOutputMocked[i].alreadyOnDb.save((err, onDbUser) => {
						if(err) done(err);

						inputAndOutputMocked[i].inputCollapse.save((err, inputCollapseUser) => {
							if(err) done(err);

							collapser.collapseDb(tempInputCollapse, service, mockedRes)
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
										if(serviceNames.indexOf(tempObjServiceName) !== -1 &&  (tempObjUser[tempObjServiceName]['name'] !== undefined
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
												console.log("<<<<<<<<<<<<<<<<<<<local service");
												console.log(originalUserSN);
												console.log(resultUserSN);
												expect(resultUserSN.email).to.be.not.undefined;
												expect(resultUserSN.name).to.be.not.undefined;
												// expect(resultUserSN.hash).to.be.not.undefined;
												expect(resultUserSN.email).to.be.equal(originalUserSN.email);
												expect(resultUserSN.name).to.be.equal(originalUserSN.name);
												console.log("<<<<<<<<<<<<<<<<<<<before to check if its valid or not");
												// expect(tempObjUser.validPassword(PASSWORD)).to.be.true;
												// expect(result.validPassword(PASSWORD)).to.be.true;
												console.log("<<<<<<<<<<<<<<<<<<<is valid password");
											} else {
												console.log("<<<<<<<<<<<<<<<<<<<3dpartyservice");
												expect(resultUserSN.id).to.be.not.undefined;
												expect(resultUserSN.token).to.be.not.undefined;
												expect(resultUserSN.email).to.be.not.undefined;
												expect(resultUserSN.name).to.be.not.undefined;
												expect(resultUserSN.id).to.be.equal(originalUserSN.id);
												expect(resultUserSN.token).to.be.equal(originalUserSN.token);
												expect(resultUserSN.email).to.be.equal(originalUserSN.email);
												expect(resultUserSN.name).to.be.equal(originalUserSN.name);
												console.log("<<<<<<<<<<<<<<<<<<<before switch");
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
												console.log("<<<<<<<<<<<<<<<<<<<after switch");
											}
										}
										console.log("<<<<<<<<<<<<<<<<<<<finishing inner for");
									}
									console.log("<<<<<<<<<<<<<<<<<<<finishing outer for");
								}
								console.log("<<<<<<<<<<<<<<<<<<<outside outer for");
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

		// describe('---ERRORS---', () => {

		// 	const serviceNameWrongMock = [undefined, null, -1, 5, 99, 600,
		// 			function(){}, ()=>{}, /fooRegex/i, [], new RegExp(/fooRegex/,'i'),
		// 			new RegExp('/fooRegex/','i'), new Error(), true, false, new Array()];

		// 	for(let i=0; i<serviceNameWrongMock.length; i++) {
		// 		it('should catch an error, because you must pass a serviceName as parameter. Test i=' + i, done => {
		// 			collapser.collapseDb({}, serviceNameWrongMock[i], mockedRes)
	 //        .then(result => {}, reason => {
	 //          expect(reason).to.be.equals('impossible to collapseDb because serviceName must be a string');
	 //          done(null);
	 //        });
		// 		});
		// 	}

		// 	const serviceNameUnrecognizedMock = [' ', '', 'fake serviceName', 'faceBRook',
		// 		'gOGle', 'loCAal', '...' ];

		// 	for(let i=0; i<serviceNameUnrecognizedMock.length; i++) {
		// 		it('should catch an error, because you must pass a recognized serviceName as parameter. Test i=' + i, done => {
		// 			collapser.collapseDb({}, serviceNameUnrecognizedMock[i], mockedRes)
	 //        .then(result => {}, reason => {
	 //          expect(reason).to.be.equals('impossible to collapseDb because serviceName is not recognized');
	 //          done(null);
	 //        });
		// 		});
		// 	}

		// 	const loggedUserWrongMock = ["not an object", undefined, null, -1, 5, 99, 600,
		// 			" ", function(){}, ()=>{}, /fooRegex/i, [], new RegExp(/fooRegex/,'i'),
		// 			new RegExp('/fooRegex/','i'), new Error(), true, false, new Array()];

		// 	for(let i=0; i<loggedUserWrongMock.length; i++) {
		// 		it('should catch an error, because you must pass an object as loggedUser\'s parameter. Test i=' + i, done => {
		// 			collapser.collapseDb(loggedUserWrongMock[i], 'local', mockedRes)
  //         .then(result => {}, reason => {
  //           expect(reason).to.be.equals('impossible to collapseDb because loggedUser is not an object');
  //           done(null);
  //         });
		// 		});
		// 	}

		// 	// it('should catch an error, because logged user hasn\'t an id for the specified serviceName', done => {
		// 	// 	collapser.collapseDb({ local : { email: 'fake'}}, 'local', mockedRes)
  //  //      .then(result => {}, reason => {
  //  //        expect(reason).to.be.equals('input id not valid while collapsing');
  //  //        done(null);
  //  //      });
		// 	// });
		// });

	});
});

after(done => User.remove({}, err => done(err)));
