'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var nock = require('nock');
var request = require('request');

var passport = require('passport');

require('../app_server/models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');

const URL_LOGOUT = '/api/logout';

var user;
var csrftoken;
var connectionSid;

const AUTH_GITHUB_BASE_URL = 'https://github.com/login/oauth';

const AUTH_GITHUB_API_URL = '/authorize?client_id=408b6ba64789e150dcc5&scope=user%3Aemail';

const GITHUB_AUTH_URL = '/api/auth/github';

const RESPONSE = 'random_data';
const EMAIL = 'fake@fake.it';
const OBJECT = 'useless email';
const MESSAGE = 'some random words';


describe('contact', () => {

	function dropUserTestDbAndLogout(done) {
		User.remove({}, err => {
			//I want to try to logout to be able to run all tests in a clean state
			//If this call returns 4xx or 2xx it's not important here
			getPartialGetRequest(URL_LOGOUT)
			.send()
			.end((err, res) => done(err));
		});
	}

	function updateCookiesAndTokens(done) {
		agent
		.get('/login')
		.end((err, res) => {
			if(err) {
				done(err1);
			} else {
				csrftoken = (res.headers['set-cookie']).filter(value =>{
					return value.includes('XSRF-TOKEN');
				})[0];
				connectionSid = (res.headers['set-cookie']).filter(value =>{
					return value.includes('connect.sid');
				})[0];
				csrftoken = csrftoken ? csrftoken.split(';')[0].replace('XSRF-TOKEN=','') : '';
		      	connectionSid = connectionSid ? connectionSid.split(';')[0].replace('connect.sid=','') : '';
		    	done();
		    }
    	});
	}

	function getPartialPostRequest (apiUrl) {
		return agent
	    	.post(apiUrl)
	    	.set('Content-Type', 'application/json')
	    	.set('Accept', 'application/json')
	    	.set('set-cookie', 'connect.sid=' + connectionSid)
	    	.set('set-cookie', 'XSRF-TOKEN=' + csrftoken);
	}

	function getPartialGetRequest (apiUrl) {
		return agent
	    	.get(apiUrl)
	    	.set('Content-Type', 'application/json')
	    	.set('Accept', 'application/json');
	}

	function getPartialNockApiUrl () {
		return nock(AUTH_GITHUB_BASE_URL)
				.get(AUTH_GITHUB_API_URL);
	}

	before(done => {
		// Connecting to a local test database or creating it on the fly
		mongoose.connect('mongodb://localhost/test-db');
		User = mongoose.model('User');
		done();
	});


	describe('#authGithub()', () => {

		describe('---YES---', () => {

			beforeEach(done => updateCookiesAndTokens(done));

			// it('should correctly login with Github', done => {

			// 	const recaptchaCorrectRespMock = {
			// 		id: '6057207',
			// 		displayName: 'Fake name
			// 		username: 'Fakeusername',
			// 		profileUrl: 'https://github.com/Ks89',
			// 		emails: [ { value: 'stefano.cappa@fake.email.it' } ],
			// 		provider: 'github'
			// 	};

   //  			console.log(connectionSid);
   //  			console.log(csrftoken);

   //  			nock('https://github.com')
   //  			.filteringPath(function(path){
			//         return '/login/oauth/authorize';
			//     })
			//     .get("/login/oauth/authorize")
			//     .reply(302,undefined,
			// 		{ location : "http://localhost:3000/api/auth/github/callback?code=b0db2c3e90889faa2949"}
			// 	);

			// 	nock("http://localhost:3000/api/auth/github/callback")
			// 	.filteringPath(function(path){
			//         return '/';
			//     })
			//     .get("/")
			//     .reply(200, "OK");

			//     nock('https://github.com/login/oauth')
			//     .filteringRequestBody(function(body) {
			// 		return '*';
			// 	})
			//     .post("/access_token", '*')
			//     .reply(200, {
   //              	'access_token' : '02c7b547e7f7a7dc5552e75ee9bdb8854ee5d373',
   //              	'scope' : 'user,email',
   //              	'token_type' : 'bearer'
   //             	});

			// 	// getPartialNockApiUrl().reply(302, recaptchaCorrectRespMock);
			// var codeFromRedirect = '';


			// var r = request({
			// 		headers: {
			// 				 'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
			// 				},
			// 		url:     'https://github.com/login/oauth/authorize?client_id=408b6ba64789e150dcc5&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgithub%2Fcallback&scope=user%3Aemail',
			// 		method: 'GET'
			// 	}, function(err, res) {

			// 	codeFromRedirect = r.uri.href.split('=')[1];
			// 	console.log(codeFromRedirect);
			// 	console.log("-------------------------------------------------------");
			// 	//console.log(r);
			//     console.log("-------------------------------------------------------");

			//     request({
			// 		headers: {
			// 				  'content-type' : 'application/json',
			// 				  'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36',
			// 				  'accept' : 'application/json'
			// 				},
			// 		url:     'https://github.com/login/oauth/access_token',
			// 		method: 'POST',
			// 		json:    {
	  //                 client_id: '408b6ba64789e150dcc5',
	  //                 client_secret: 'add yout client secret',
	  //                 code: codeFromRedirect,
	  //                 //redirect_uri: 'http://localhost:3000/api/auth/github/callback'
	  //               }
			// 	}, function(error, response, body){
			// 		console.log("----------**----------");
			// 		console.log(body);
			// 		console.log(body.access_token)
			// 		console.log("----------**----------");

			// 		request({
			// 			headers: {
			// 					 'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
			// 					},
			// 			url:     "https://api.github.com/user?access_token=" + body.access_token,
			// 			method: 'GET'
			// 		}, function(err, res, body) {
			//     		console.log(body);
			//     		done(err);
			//     	});

			// 	});


			// });

	  //  //   	var re = getPartialGetRequest(GITHUB_AUTH_URL)
			// 	// //.set('XSRF-TOKEN', csrftoken)
			// 	// //.send(contactMock)
			// 	// .set('set-cookie', 'connect.sid=' + connectionSid)
	  //  //  		.set('set-cookie', 'XSRF-TOKEN=' + csrftoken)
	  //  //  		.redirects(2)
			// 	// .send()
			// 	// .expect(302)
			// 	// .expect('Location', '/profile')
			// 	// .end((err, res) => {
			// 	// 	// console.log(re);
			// 	// 	const URL_SESSIONTOKEN = '/api/sessionToken';
			// 	// 	// getPartialGetRequest(URL_SESSIONTOKEN)
			// 	// 	// 	.send()
			// 	// 	// 	.expect(200)
			// 	// 	// 	.end((err, res) => {
			// 	// 	// 		console.log(res.body);
			// 	// 	// 		// const resp = JSON.parse(res.body);
			// 	// 	// 		// expect(resp.token).to.be.not.undefined;
			// 	// 	 		done();
			// 	// 	// 	});
			// 	// 	//console.log(res.body);
			// 	// 	// expect(res.body).to.be.equals(EMAIL);
			// 	//  //	done();
			// 	// });

			// });

			// it('should correctly login with Github', done => {

			// 	const recaptchaCorrectRespMock = {
			// 		id: '6057207',
			// 		displayName: 'Stefano Cappa',
			// 		username: 'Ks89',
			// 		profileUrl: 'https://github.com/Ks89',
			// 		emails: [ { value: 'stefano.cappa@fake.email.it' } ],
			// 		provider: 'github'
			// 	};

   //  			console.log(connectionSid);
   //  			console.log(csrftoken);

   //  			nock('https://github.com')
   //  			.filteringPath(function(path){
			//         return '/login/oauth/authorize';
			//     })
			//     .get("/login/oauth/authorize")
			//     .reply(302,undefined,
			// 		{ location : "http://localhost:3000/api/auth/github/callback?code=b0db2c3e90889faa2949"}
			// 	);

			// 	nock("http://localhost:3000/api/auth/github")
			// 	// .filteringPath(function(path){
			//  //        return '/';
			//  //    })
			//     .get("callback?code=b0db2c3e90889faa2949")
			//     .reply(302, {
			//     	user : {
			// 	    	github : {
			// 		 		id : recaptchaCorrectRespMock.id,
			// 		    	token : '02c7b547e7f7a7dc5552e75ee9bdb8854ee5d373',
			// 		        name  : recaptchaCorrectRespMock.displayName,
			// 		        username : recaptchaCorrectRespMock.username,
			// 		        profileUrl : recaptchaCorrectRespMock.profileUrl,
			// 		        email : recaptchaCorrectRespMock.emails[0].value
			// 			}
			//     	}
			//     });

			//  //    nock('https://github.com/login/oauth')
			//  //    .filteringRequestBody(function(body) {
			// 	// 	return '*';
			// 	// })
			//  //    .post("/access_token", '*')
			//  //    .reply(200, {
   //  //             	'access_token' : '02c7b547e7f7a7dc5552e75ee9bdb8854ee5d373',
   //  //             	'scope' : 'user,email',
   //  //             	'token_type' : 'bearer'
   //  //            	});


	  //    		getPartialGetRequest(GITHUB_AUTH_URL)
			// 	//.set('XSRF-TOKEN', csrftoken)
			// 	//.send(contactMock)
			// 	.set('set-cookie', 'connect.sid=' + connectionSid)
	  //   		.set('set-cookie', 'XSRF-TOKEN=' + csrftoken)
	  //   		.redirects(5)
			// 	.send()
			// 	.expect(302)
			// 	.expect('Location', '/profile')
			// 	.end((err, res) => {
			// 		// console.log(re);
			// 		//here I should be at /profile

			// 		const URL_SESSIONTOKEN = '/api/sessionToken';
			// 		getPartialGetRequest(URL_SESSIONTOKEN)
			// 			.send()
			// 			.expect(200)
			// 			.end((err, res) => {
			// 				console.log(res.body);
			// 				// const resp = JSON.parse(res.body);
			// 				// expect(resp.token).to.be.not.undefined;
			// 		 		done();
			// 			});
			// 		//console.log(res.body);
			// 		// expect(res.body).to.be.equals(EMAIL);
			// 	 //	done();
			// 	});

			// });

			it('should correctly login with Github', done => {

				passport._strategies.facebook._profile = {
					id: 6057207,
					displayName: 'Stefano Cappa',
					username: 'Ks89',
					profileUrl: 'https://github.com/Ks89',
					emails: [ { value: 'stefano.cappa@fake.email.it' } ]
				};

	     		getPartialGetRequest('/api/auth/facebook')
				//.set('XSRF-TOKEN', csrftoken)
				//.send(contactMock)
				.set('set-cookie', 'connect.sid=' + connectionSid)
	    		.set('set-cookie', 'XSRF-TOKEN=' + csrftoken)
				.send()
				// .expect(302)
				// .expect('Location', '/profile')
				.end((err, res) => {
					// console.log(res);
					//here I should be at /profile

					const URL_SESSIONTOKEN = '/api/sessionToken';
					getPartialGetRequest(URL_SESSIONTOKEN)
						.send()
						//.expect(200)
						.end((err, res) => {
							console.log(res.body);
							// const resp = JSON.parse(res.body);
							// expect(resp.token).to.be.not.undefined;
					 		done(err);
						});
					//console.log(res.body);
					// expect(res.body).to.be.equals(EMAIL);
				 //	done();
				});

			});

		});

			afterEach(done => dropUserTestDbAndLogout(done));


	});

	after(done => {
		User.remove({}, err => {
			console.log('collection removed')
			done(err);
		});
	});
});
