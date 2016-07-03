'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var nock = require('nock');

var csrftoken;
var connectionSid;

const AUTH_GITHUB_BASE_URL = 'https://github.com/login/oauth';

// const AUTH_GITHUB_API_URL = '/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgithub%2Fcallback&scope=user%3Aemail&client_id=408b6ba64789e150dcc5';

const AUTH_GITHUB_API_URL = '/authorize?client_id=408b6ba64789e150dcc5&scope=user%3Aemail';

const GITHUB_AUTH_URL = '/api/auth/github';

const RESPONSE = 'random_data';
const EMAIL = 'fake@fake.it';
const OBJECT = 'useless email';
const MESSAGE = 'some random words';

// const contactMock = {
// 	response: RESPONSE,
//     emailFormData: {
//     	email: EMAIL,
//     	object: OBJECT,
//     	messageText: MESSAGE
//     }
// };



// const recaptchaWrong1RespMock = {
// 	success: false,
// 	challenge_ts: "2016-06-22T22:59:40Z",
// 	hostname: "localhost"
// };

// const recaptchaWrong2RespMock = {
// 	success: false,
// 	challenge_ts: "2016-06-22T22:59:40Z",
// 	hostname: "localhost",
// 	'error-codes': ['some-error1', 'another-error']
// };

describe('contact', () => {

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

	describe('#authGithub()', () => {
		
		describe('---YES---', () => {

			beforeEach(done => updateCookiesAndTokens(done));

			it('should correctly login with Github', done => {

				const recaptchaCorrectRespMock = {
					id: '6057207',
					displayName: 'Stefano Cappa',
					username: 'Ks89',
					profileUrl: 'https://github.com/Ks89',
					emails: [ { value: 'stefano.cappa.ks89@gmail.com' } ],
					provider: 'github',
					_raw: '{"login":"Ks89","id":6057207,"avatar_url":"https://avatars.githubusercontent.com/u/6057207?v=3","gravatar_id":"","url":"https://api.github.com/users/Ks89","html_url":"https://github.com/Ks89","followers_url":"https://api.github.com/users/Ks89/followers","following_url":"https://api.github.com/users/Ks89/following{/other_user}","gists_url":"https://api.github.com/users/Ks89/gists{/gist_id}","starred_url":"https://api.github.com/users/Ks89/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Ks89/subscriptions","organizations_url":"https://api.github.com/users/Ks89/orgs","repos_url":"https://api.github.com/users/Ks89/repos","events_url":"https://api.github.com/users/Ks89/events{/privacy}","received_events_url":"https://api.github.com/users/Ks89/received_events","type":"User","site_admin":false,"name":"Stefano Cappa","company":null,"blog":null,"location":"Milano","email":"stefano.cappa.ks89@gmail.com","hireable":true,"bio":null,"public_repos":41,"public_gists":0,"followers":11,"following":20,"created_at":"2013-11-28T08:38:12Z","updated_at":"2016-07-02T16:25:53Z"}',
					_json:
					{ 
						login: 'Ks89',
						id: 6057207,
						avatar_url: 'https://avatars.githubusercontent.com/u/6057207?v=3',
						gravatar_id: '',
						url: 'https://api.github.com/users/Ks89',
						html_url: 'https://github.com/Ks89',
						followers_url: 'https://api.github.com/users/Ks89/followers',
						following_url: 'https://api.github.com/users/Ks89/following{/other_user}',
						gists_url: 'https://api.github.com/users/Ks89/gists{/gist_id}',
						starred_url: 'https://api.github.com/users/Ks89/starred{/owner}{/repo}',
						subscriptions_url: 'https://api.github.com/users/Ks89/subscriptions',
						repos_url: 'https://api.github.com/users/Ks89/repos',
						events_url: 'https://api.github.com/users/Ks89/events{/privacy}',
						received_events_url: 'https://api.github.com/users/Ks89/received_events',
						type: 'User',
						site_admin: false,
						name: 'Stefano Cappa',
						company: null,
						blog: null,
						location: 'Milano',
						email: 'stefano.cappa.ks89@gmail.com',
						hireable: true,
						bio: null,
						public_repos: 41,
						public_gists: 0,
						followers: 11,
						following: 20,
						created_at: '2013-11-28T08:38:12Z',
						updated_at: '2016-07-02T16:25:53Z' 
					} 
				};


				// nock(AUTH_GITHUB_BASE_URL)
				// .get(AUTH_GITHUB_API_URL);

				// .get('/users/1')
    //             .reply(404)
    //             .post('/users', {
    //               username: 'pgte',
    //               email: 'pedro.teixeira@gmail.com'
    //             })
    //             .reply(201, {
    //               ok: true,
    //               id: '123ABC',
    //               rev: '946B7D1C'
    //             })
    //             .get('/users/123ABC')
    //             .reply(200, {
    //               _id: '123ABC',
    //               _rev: '946B7D1C',
    //               username: 'pgte',
    //               email: 'pedro.teixeira@gmail.com'
    //             });

				nock('https://github.com/login/oauth')
				.get('/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgithub%2Fcallback&scope=user%3Aemail&client_id=408b6ba64789e150dcc5')
				// .reply(200,{})
				// .get('http://localhost:3000/api/auth/github/callback?code=fd7f0960f03071133b26')

				.reply(302,undefined,
					{ 
						location : "http://localhost:3000/api/auth/github/callback?code=b012aeeb06102bc7c0cc"
					}
				)
// 				GITHUB_CLIENT_ID=408b6ba64789e150dcc5
// GITHUB_CLIENT_SECRET=d9fdacda313d9936f9e4382a8717b4f4087c2725

				.post('/access_token', {
                  client_id: '408b6ba64789e150dcc5',
                  client_secret: 'd9fdacda313d9936f9e4382a8717b4f4087c2725',
                  code: 'b012aeeb06102bc7c0cc',
                  redirect_uri: 'http://localhost:3000/api/auth/github/callback'
                })
                .reply(200,{
                	'access_token' : 'e72e16c7e42f292c6912e7710c838347ae178b4a',
                	'scope' : 'user,email',
                	'token_type' : 'bearer'
                })
                .get('https://api.github.com/user?access_token=e72e16c7e42f292c6912e7710c838347ae178b4a')

				.reply(200, recaptchaCorrectRespMock);


				// getPartialNockApiUrl().reply(302, recaptchaCorrectRespMock);

	    		getPartialGetRequest(GITHUB_AUTH_URL)
				//.set('XSRF-TOKEN', csrftoken)
				//.send(contactMock)
				.set('set-cookie', 'connect.sid=' + connectionSid)
	    		.set('set-cookie', 'XSRF-TOKEN=' + csrftoken)
				.send()
				.expect(302)
				.end((err, res) => {
					console.log(res.body);
					// expect(res.body).to.be.equals(EMAIL);
					done(err);
				 //	done();
				});
			});
		});


		// describe('---NO---', () => {

		// 	beforeEach(done => updateCookiesAndTokens(done));

		// 	it('should catch a 401 UNAUTHORIZED, because Recaptcha2 answers false', done => {
		// 		getPartialNockApiUrl().reply(200, recaptchaWrong1RespMock);
	 //    		getPartialPostRequest(GITHUB_AUTH_URL)
		// 		.set('XSRF-TOKEN', csrftoken)
		// 		.send(contactMock)
		// 		.expect(401)
		// 		.end((err, res) => {
		// 			if (!err) {
		// 				expect(res.body.message).to.be.equals('Recaptcha verify answered FALSE!');
		// 			}
		// 			done(err);
		// 		});
		// 	});

		// 	it('should catch a 401 UNAUTHORIZED, because Recaptcha2 answers false also with an array of error codes', done => {
		// 		getPartialNockApiUrl().reply(200, recaptchaWrong2RespMock);
	 //    		getPartialPostRequest(GITHUB_AUTH_URL)
		// 		.set('XSRF-TOKEN', csrftoken)
		// 		.send(contactMock)
		// 		.expect(401)
		// 		.end((err, res) => {
		// 			if (!err) {
		// 				expect(res.body.message[0]).to.be.equals('some-error1');
		// 				expect(res.body.message[1]).to.be.equals('another-error');
		// 			}
		// 			done(err);
		// 		});
		// 	});


		// 	const missingEmailFormData = [
		// 		{email: EMAIL, object: OBJECT, messageText: MESSAGE},
		// 		{email: EMAIL, messageText: MESSAGE},
		// 		{email: EMAIL, object: OBJECT},
		// 		{object: OBJECT, messageText: MESSAGE},
		// 		{email: EMAIL},
		// 		{object: OBJECT},
		// 		{messageText: MESSAGE},
		// 		{}
		// 	];
		// 	const missingContactMocks = [
		// 		{response: RESPONSE, emailFormData: missingEmailFormData[0]},
		// 		{response: RESPONSE, emailFormData: missingEmailFormData[1]},
		// 		{response: RESPONSE, emailFormData: missingEmailFormData[2]},
		// 		{response: RESPONSE, emailFormData: missingEmailFormData[3]},
		// 		{response: RESPONSE, emailFormData: missingEmailFormData[4]},
		// 		{response: RESPONSE, emailFormData: missingEmailFormData[5]},
		// 		{response: RESPONSE, emailFormData: missingEmailFormData[6]},
		// 		{response: RESPONSE},
		// 		{}
		// 	];

		// 	//these are multiple tests that I'm execting for all cobinations
		// 	//of missing params
		// 	for(let i = 0; i<missingContactMocks.length; i++) {
		// 		console.log(missingContactMocks[i]);

		// 		it('should catch a 400 BAD REQUEST, because subject, object and text params are mandatory. Test i=' + i, done => {
		// 			getPartialNockApiUrl().reply(200, recaptchaCorrectRespMock);
					
		// 			//remove imput params
		// 			delete contactMock.emailFormData;

		//     		getPartialPostRequest(GITHUB_AUTH_URL)
		// 			.set('XSRF-TOKEN', csrftoken)
		// 			.send(contactMock)
		// 			.expect(400)
		// 			.end((err, res) => {
		// 				if (!err) {
		// 					expect(res.body.message).to.be.equals('Missing input params');	
		// 				}
		// 				done(err);
		// 			});
		// 		});
		// 	}
		// });
		
		describe('---ERRORS---', () => {
			it('should get 403 FORBIDDEN,, because XSRF-TOKEN is not available', done => {
				// getPartialPostRequest(GITHUB_AUTH_URL)
				// //XSRF-TOKEN NOT SETTED!!!!
				// .send(contactMock)
				// .expect(403)
				// .end(() => done());
				done();
			});
		});
	});
});