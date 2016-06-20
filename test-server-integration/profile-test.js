'user strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var async = require('async');

require('../app_server/models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var user;
var csrftoken;
var connectionSid;

const USER_NAME = 'username';
const USER_EMAIL = 'email@email.it';
const USER_PASSWORD = 'Password1';

const loginMock = {
	email : USER_EMAIL,
	password : USER_PASSWORD
};

const URL_PROFILE = '/api/profile';
const URL_LOGIN = '/api/login';

describe('profile', () => {

	function updateCookiesAndTokens(done) {
		agent
		.get('/login')
		.end((err1, res1) => {
			if(err1) {
				throw "Error while calling login page";
			} else {
				csrftoken = (res1.headers['set-cookie']).filter(value =>{
					return value.includes('XSRF-TOKEN');
				})[0];
				connectionSid = (res1.headers['set-cookie']).filter(value =>{
					return value.includes('connect.sid');
				})[0];
				csrftoken = csrftoken ? csrftoken.split(';')[0].replace('XSRF-TOKEN=','') : '';
				connectionSid = connectionSid ? connectionSid.split(';')[0].replace('connect.sid=','') : '';
				done();
			}
		});
	}

	function insertUserTestDb(done) {
		user = new User();
		user.local.name = USER_NAME;
		user.local.email = USER_EMAIL;
		user.setPassword(USER_PASSWORD);
		user.github.id = '1231232';
	  	user.github.token = 'TOKEN';
		user.github.email = 'email@email.it';
		user.github.name = 'username';
		user.github.username = 'username';
		user.github.profileUrl = 'http://fakeprofileurl.com/myprofile';
		user.profile = {
			name : 'usernameUpdated',
			surname : 'surnameUpdated',
			nickname : 'nicknameUpdated',
			email : 'email@emailprofile.it',
			updated : new Date(),
			visible : true
		};
		user.save((err, usr) => {
			if(err) {
				done(err);
			}
			user._id = usr._id;
			updateCookiesAndTokens(done); //pass done, it's important!
		});
	}

	//usefull function that prevent to copy and paste the same code
	function getPartialPostRequest (apiUrl) {
		return agent
			.post(apiUrl)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.set('set-cookie', 'connect.sid=' + connectionSid)
			.set('set-cookie', 'XSRF-TOKEN=' + csrftoken);
	}

	function dropUserCollectionTestDb(done) {
		User.remove({}, err => { 
			done(err);
		});
	}

	describe('#login()', () => {
		describe('---YES---', () => {

			beforeEach(done => insertUserTestDb(done));

			it('should correctly update the profile by github id', done => {

				const mockedProfilePost = {
					localUserEmail: user.local.email,
					id: "", //only for 3dauth
					serviceName: "local",
					name: user.profile.name,
					surname: user.profile.surname,
					nickname: user.profile.nickname,
					email: user.profile.email
				};

				async.waterfall([
					asyncDone => {
						getPartialPostRequest(URL_LOGIN)
						.set('XSRF-TOKEN', csrftoken)
						.send(loginMock)
						.expect(200)
						.end((err, res) => {
							expect(res.body.token).to.be.not.null;
							expect(res.body.token).to.be.not.undefined;
							asyncDone(err);
						});
					},
					asyncDone => {
						getPartialPostRequest(URL_PROFILE)
						.set('XSRF-TOKEN', csrftoken)
						.send(mockedProfilePost)
						.expect(200)
						.end((err, res) => {
							expect(res.body.message).to.be.equals("Profile updated successfully!");
							asyncDone(err);
						});
					},
					asyncDone => {
						User.findOne({ 'local.email': USER_EMAIL }, (err, usr) => {
							expect(usr.local.name).to.be.equals(user.local.name);
							expect(usr.local.email).to.be.equals(user.local.email);
					       	expect(usr.validPassword(USER_PASSWORD));
							expect(usr.profile.name).to.be.equals(user.profile.name);
							expect(usr.profile.surname).to.be.equals(user.profile.surname);
							expect(usr.profile.nickname).to.be.equals(user.profile.nickname);
							expect(usr.profile.email).to.be.equals(user.profile.email);
							//expect(usr.profile.updated).to.be.equals(user.profile.updated);
							expect(usr.profile.visible).to.be.equals(user.profile.visible);

							asyncDone(err);
					    });	
					}
				], (err, response) => done(err));				
			});

			afterEach(done => dropUserCollectionTestDb(done));
		});

		describe('---NO - Missing params or not accepted combination of them---', () => {

			before(done => insertUserTestDb(done));

			const missingServiceNameParams = [
				{localUserEmail: 'fake_email', name:'a',surname:'b',nickname:'c',email:'d'},
				{localUserEmail: 'fake_email', id: 'fake_id', name:'a',surname:'b',nickname:'c',email:'d'},
				{}
			];
			const missingLocalParams = [
				{id: 'fake_id', serviceName: "local", name:'a',surname:'b',nickname:'c',email:'d'},
				{serviceName: "local", name:'a',surname:'b',nickname:'c',email:'d'}
			];
			const missing3dAuthParams = [
				{localUserEmail: 'fake_email', serviceName: "github", name:'a',surname:'b',nickname:'c',email:'d'},
				{localUserEmail: 'fake_email', serviceName: "github", name:'a'}
			];
			const missingProfileParams = [
				{localUserEmail: 'fake_email', serviceName: "local", name:'a',surname:'b',email:'d'},
				{localUserEmail: 'fake_email', serviceName: "local", id: 'fake_id', email:'d'},
				{id: 'fake_id', serviceName: "github",surname:'b',nickname:'c',email:'d'},
				{id: 'fake_id', serviceName: "github", name:'a',surname:'b',nickname:'c'},
				{localUserEmail: 'fake_email', serviceName: "local", id:'fake_id', name:'a',surname:'b'},
				{serviceName: "github", id:'fake_id'}
			];

			const testAggregator = [
				{test: missingServiceNameParams, resultMsg: 'ServiceName is required'},
				{test: missingLocalParams, resultMsg: 'LocalUserEmail is required if you pass serviceName = local'}, 
				{test: missing3dAuthParams, resultMsg: 'id is required if you pass serviceName != local'}, 
				{test: missingProfileParams, resultMsg: 'All profile params are mandatory'}
			];

			//these are multiple tests that I'm execting for all cobinations of wrong params 
			//(two fors because testAggregator contains test with the real array of tests)
			for(let i = 0; i<testAggregator.length; i++) {
				for(let j = 0; j<testAggregator[i].test.length; j++) {
					console.log(testAggregator[i].test[j]);
					it('should get 400 BAD REQUEST,' + testAggregator[i].resultMsg + '. Test i=' + i + ', j=' + j, done => {
						getPartialPostRequest(URL_PROFILE)
						.set('XSRF-TOKEN', csrftoken)
						.send(testAggregator[i].test[j])
						.expect(400)
						.end((err, res) => {
							if (err) {
								return done(err);
							} else {
								console.log(res.body);
								expect(res.body.message).to.be.equals(testAggregator[i].resultMsg);
								done();
							}
						});
					});
				}
			}

			after(done => dropUserCollectionTestDb(done));
			
		});


		describe('---NO - Wrong params---', () => {

			before(done => insertUserTestDb(done));

			const wrongLocalProfileMock = {
				localUserEmail: 'WRONG_EMAIL',
				serviceName: "local",
				name: "random_name",
				surname: "random_surname",
				nickname: "random_nickname",
				email: "random_email"
			};

			const wrong3dAuthProfileMock = {
				id: 'WRONG_ID',
				serviceName: "github",
				name: "random_name",
				surname: "random_surname",
				nickname: "random_nickname",
				email: "random_email"
			};

			const wrongParamProfileUpdate = [ wrongLocalProfileMock, wrong3dAuthProfileMock ];

			//these are multiple tests that I'm execting for all cobinations 
			//of wrong params 
			for(let i = 0; i<wrongParamProfileUpdate.length; i++) {
				console.log(wrongParamProfileUpdate[i]);
				it('should get 401 UNAUTHORIZED, because you must pass correct the email/id', done => {
					getPartialPostRequest(URL_PROFILE)
					.set('XSRF-TOKEN', csrftoken)
					.send(wrongParamProfileUpdate[i])
					.expect(401)
					.end((err, res) => {
						if (err) {
							return done(err);
						} else {
							console.log(res.body);
							expect(res.body.message).to.be.equals('Cannot update your profile. Please try to logout and login again.');
							done();
						}
					});
				});
			}

			after(done => dropUserCollectionTestDb(done));
			
		});
	});


	describe('---ERRORS---', () => {
		it('should get 403 FORBIDDEN, because XSRF-TOKEN is not available', done => {
			getPartialPostRequest(URL_PROFILE)
			//XSRF-TOKEN NOT SETTED!!!!
			.send({}) //It's not necessary to pass real data here
			.expect(403)
			.end(() => done());
		});
	});
});