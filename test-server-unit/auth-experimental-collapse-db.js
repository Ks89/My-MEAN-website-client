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
	      case 'github':
	        newUser[serviceName].username = USERNAME;
	        newUser[serviceName].profileUrl = 'http//fakeprofileurl.com/myprofile';
	      case 'twitter':
	        newUser[serviceName].username  = USERNAME;
	    }

	    console.log("########################++++++++++++++++++++++++");
	    console.log(newUser);
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
			console.log("getting user..");
			var newUser = new User();
			console.log("user created");
			if(isAddProfile === true) {
				addProfile(newUser);
			}
			for(let serviceName of serviceNames) {
				if(serviceName === 'local') {
					addLocalUser(newUser);
				} else {
					console.log("######################## " + serviceName);
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
			{alreadyOnDb:getUser(['facebook','twitter'],true), inputCollapse:getUser(['facebook','twitter'],true), service:'twitter'},
			{alreadyOnDb:getUser(['facebook','linkedin'],false), inputCollapse:getUser(['facebook','github'],false), service:'facebook'},
			{alreadyOnDb:getUser(['google','github'],false), inputCollapse:getUser(['github','facebook'],false), service:'github'},
			{alreadyOnDb:getUser(['google','twitter'],true), inputCollapse:getUser(['github','google'],false), service:'google'},
			{alreadyOnDb:getUser(['google','linkedin'],true), inputCollapse:getUser(['linkedin','twitter'],true), service:'linkedin'},
			{alreadyOnDb:getUser(['github','twitter'],true), inputCollapse:getUser(['github','google'],true), service:'github'},
			{alreadyOnDb:getUser(['github','linkedin'],false), inputCollapse:getUser(['linkedin','local'],false), service:'linkedin'},
			{alreadyOnDb:getUser(['twitter','linkedin'],true), inputCollapse:getUser(['local','twitter'],false), service:'twitter'}
	];

		describe('---YES---', () => {

			for(let i=0; i<inputAndOutputMocked.length; i++) {
				it('should collapse the db and check that users has been merged', done => {
					var tempAlreadyOnDbUser;
					var tempInputCollapse;


					console.log("@@@@@@@@@@@@@@@@@@1@@@@@@@@@@@@@");
		      console.log(inputAndOutputMocked[i]);
		      console.log("@@@@@@@@@@@@@@@@@@2@@@@@@@@@@@@@");


					inputAndOutputMocked[i].alreadyOnDb.save((err, onDbUser) => {
						expect(err).to.be.null;
						// expect(onDbUser.validPassword(PASSWORD)).to.be.true;
						tempAlreadyOnDbUser = onDbUser;

						console.log("@@@@@@@@@@@@@@@@@@A@@@@@@@@@@@@@");
		        console.log(tempAlreadyOnDbUser);
		        console.log("@@@@@@@@@@@@@@@@@@B@@@@@@@@@@@@@");

						inputAndOutputMocked[i].inputCollapse.save((err, inputCollapseUser) => {
							expect(err).to.be.null;
							tempInputCollapse = inputCollapseUser;


 							console.log("@@@@@@@@@@@@@@@@@@alreadyOnDb@@@@@@@@@@@@@");
		          console.log(tempAlreadyOnDbUser);
		          console.log("@@@@@@@@@@@@@@@@@@inputCollapseUser@@@@@@@@@@@@@");
		          console.log(tempInputCollapse);
		          console.log("@@@@@@@@@@@@@@@@@@COLLAPSE RESULT@@@@@@@@@@@@@");


							collapser.collapseDb(tempInputCollapse, inputAndOutputMocked[i].service, mockedRes)
		          .then(result => {
		            console.log("collapseDb localuser with 3dpartyauth promise");
		            console.log(result);

		            console.log("----------------alreadyOnDb---------------");
		            console.log(tempAlreadyOnDbUser);
		            console.log("----------------inputCollapseUser---------------");
		            console.log(tempInputCollapse);
		            console.log("----------------COLLAPSE RESULT---------------");
		            console.log(result);

		            // expect(result.local.name).to.be.equals(tempAlreadyOnDbUser.local.name);
		            // expect(result.local.email).to.be.equals(tempAlreadyOnDbUser.local.email);
		            // expect(result.google.id).to.be.equals(tempInputCollapse.google.id);
		            // expect(result.google.token).to.be.equals(tempInputCollapse.google.token);
		            // expect(result.google.name).to.be.equals(tempInputCollapse.google.name);
		            // expect(result.google.email).to.be.equals(tempInputCollapse.google.email);
		            // expect(result.github.id).to.be.equals(tempInputCollapse.github.id);
		            // expect(result.github.token).to.be.equals(tempInputCollapse.github.token);
		            // expect(result.github.name).to.be.equals(tempInputCollapse.github.name);
		            // expect(result.github.email).to.be.equals(tempInputCollapse.github.email);
		            // expect(result.github.id).to.be.equals(tempAlreadyOnDbUser.github.id);
		            // expect(result.github.token).to.be.equals(tempAlreadyOnDbUser.github.token);
		            // expect(result.github.name).to.be.equals(tempAlreadyOnDbUser.github.name);
		            // expect(result.github.email).to.be.equals(tempAlreadyOnDbUser.github.email);

		            User.remove({}, err => {
									console.log('collection removed')
									done(err);
								});
		          }, reason => {
		            console.log("ERROR collapseDb localuser with 3dpartyauth promise");
		            User.remove({}, err => {
									console.log('collection removed')
									done(err);
								});
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
