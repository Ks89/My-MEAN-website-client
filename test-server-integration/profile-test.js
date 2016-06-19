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
						getPartialPostRequest('/api/login')
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
						getPartialPostRequest('/api/profile')
						.set('XSRF-TOKEN', csrftoken)
						.send(mockedProfilePost)
						.expect(200)
						.end((err, res) => {
							expect(res.body).to.be.equals("Profile updated successfully!");
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
	});


	describe('---ERRORS---', () => {
		it('should get 403 FORBIDDEN, because XSRF-TOKEN is not available', done => {
			getPartialPostRequest('/api/profile')
			//XSRF-TOKEN NOT SETTED!!!!
			.send({}) //It's not necessary to pass real data here
			.expect(403)
			.end(() => done());
		});
	});
});