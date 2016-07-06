'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var nock = require('nock');
var request = require('request');
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

    			console.log(connectionSid);
    			console.log(csrftoken);

    			nock('https://github.com')
    			.filteringPath(function(path){
			        return '/login/oauth/authorize';
			    })
			    .get("/login/oauth/authorize")
			    .reply(302,undefined,
					{ 
						location : "http://localhost:3000/api/auth/github/callback?code=b012aeeb06102bc7c0cc"
					}
				);

				nock("http://localhost:3000/api/auth/github/callback")
				.filteringPath(function(path){
			        return '/';
			    })
			    .get("/")
			    .reply(200, "OK");



			    nock('https://github.com/login/oauth')
			    .filteringRequestBody(function(body) {
					return '*';
				})
			    .post("/access_token", '*')
			    .reply(200, {
                	'access_token' : 'e72e16c7e42f292c6912e7710c838347ae178b4a',
                	'scope' : 'user,email',
                	'token_type' : 'bearer'
               	});

				// nock('https://github.com/login/oauth')
				// .get('/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgithub%2Fcallback&scope=user%3Aemail&client_id=408b6ba64789e150dcc5')
				// // .reply(200,{})
				// // .get('http://localhost:3000/api/auth/github/callback?code=fd7f0960f03071133b26')

				// .reply(302,undefined,
				// 	{ 
				// 		location : "http://localhost:3000/api/auth/github/callback?code=b012aeeb06102bc7c0cc"
				// 	}
				// )
				// .post('/access_token', {
    //               client_id: '408b6ba64789e150dcc5',
    //               client_secret: 'd9fdacda313d9936f9e4382a8717b4f4087c2725',
    //               code: 'b012aeeb06102bc7c0cc',
    //               redirect_uri: 'http://localhost:3000/api/auth/github/callback'
    //             })
    //             .reply(200,{
    //             	'access_token' : 'e72e16c7e42f292c6912e7710c838347ae178b4a',
    //             	'scope' : 'user,email',
    //             	'token_type' : 'bearer'
    //             })
    //             .get('https://api.github.com/user?access_token=e72e16c7e42f292c6912e7710c838347ae178b4a')

				// .reply(200, recaptchaCorrectRespMock);


				// getPartialNockApiUrl().reply(302, recaptchaCorrectRespMock);
				

			request({
					headers: {
							 'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
							},
					url:     'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgithub%2Fcallback&scope=user%3Aemail&client_id=408b6ba64789e150dcc5',
					method: 'GET'
				}, function(err, res, body) {

			    console.log(body);

			    request({
					headers: {'content-type' : 'application/json',
							  'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
							},
					url:     'https://github.com/login/oauth/access_token',
					method: 'POST',
					json:    {
	                  client_id: '408b6ba64789e150dcc5',
	                  client_secret: 'd9fdacda313d9936f9e4382a8717b4f4087c2725',
	                  code: 'b012aeeb06102bc7c0cc',
	                  redirect_uri: 'http://localhost:3000/api/auth/github/callback'
	                }
				}, function(error, response, body){
					console.log(body);
					
					request({
						headers: {
								 'user-agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
								},
						url:     "https://api.github.com/user?access_token=e72e16c7e42f292c6912e7710c838347ae178b4a",
						method: 'GET'
					}, function(err, res, body) {
			    		console.log(body);
			    		done(err);
			    	});

				});

			    
			});

			



				// agent
	   //  		.get('https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgithub%2Fcallback&scope=user%3Aemail&client_id=408b6ba64789e150dcc5')
				// //.set('XSRF-TOKEN', csrftoken)
				// //.send(contactMock)
				// .set('set-cookie', 'connect.sid=' + connectionSid)
	   //  		.set('set-cookie', 'XSRF-TOKEN=' + csrftoken)
				// .send()
				// .expect(200)
				// .end((err, res) => {
				// 	console.log(res);
				// 	// expect(res.body).to.be.equals(EMAIL);
				// 	done(err);
				//  //	done();
				// });
			});

			// it('should correctly login with Facebook', done => {

			// 	const recaptchaCorrectRespMock = {
			// 		id: '925672560814690',
			// 		username: undefined,
			// 		displayName: undefined,
			// 		name: {
			// 			familyName: 'Cappa',
			// 		  	givenName: 'Stefano',
			// 		  	middleName: undefined 
			// 		},
			// 		gender: 'male',
			// 		profileUrl: 'https://www.facebook.com/app_scoped_user_id/925672560814690/',
			// 		emails: [ { value: 'stefano.cappa@yahoo.it' } ],
			// 		provider: 'facebook',
			// 		_raw: '{"id":"925672560814690","email":"stefano.cappa\\u0040yahoo.it","gender":"male","link":"https:\\/\\/www.facebook.com\\/app_scoped_user_id\\/925672560814690\\/","locale":"it_IT","last_name":"Cappa","first_name":"Stefano","timezone":2,"updated_time":"2015-06-14T14:20:52+0000","verified":true}',
			// 		_json: { 
			// 			id: '925672560814690',
			// 			email: 'stefano.cappa@yahoo.it',
			// 			gender: 'male',
			// 			link: 'https://www.facebook.com/app_scoped_user_id/925672560814690/',
			// 			locale: 'it_IT',
			// 			last_name: 'Cappa',
			// 			first_name: 'Stefano',
			// 			timezone: 2,
			// 			updated_time: '2015-06-14T14:20:52+0000',
			// 			verified: true 
			// 		}					
			// 	};


			// 	// nock(AUTH_GITHUB_BASE_URL)
			// 	// .get(AUTH_GITHUB_API_URL);

			// 	// .get('/users/1')
   //  //             .reply(404)
   //  //             .post('/users', {
   //  //               username: 'pgte',
   //  //               email: 'pedro.teixeira@gmail.com'
   //  //             })
   //  //             .reply(201, {
   //  //               ok: true,
   //  //               id: '123ABC',
   //  //               rev: '946B7D1C'
   //  //             })
   //  //             .get('/users/123ABC')
   //  //             .reply(200, {
   //  //               _id: '123ABC',
   //  //               _rev: '946B7D1C',
   //  //               username: 'pgte',
   //  //               email: 'pedro.teixeira@gmail.com'
   //  //             });

   //  			console.log(connectionSid);
   //  			console.log(csrftoken);

			// 	nock('https://www.facebook.com/dialog')
			// 	.get('/oauth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Ffacebook%2Fcallback&scope=email&client_id=1551851841772033')
			// 	// .reply(200,{})
			// 	// .get('http://localhost:3000/api/auth/github/callback?code=fd7f0960f03071133b26')

			// 	.reply(302,undefined,
			// 		{ 
			// 			location : "http://localhost:3000/api/auth/facebook/callback?code=AQCZBOv_2SNzfG8FFIsjC5Qqb5IIzmWlTbbTggFEqPupqAY5eP2W8TJMmlpePY4tOOfPIkGs1azF9EPt3Apuu6G3hanHb9Y9J05qAxRsC1XT03yL-Cpw5nFsJiP1ozmEKtBtNRxUKmA9ao6I_hXDLgeC88OFfAefUcvX2F4Agir0M59FzfsPdoqjRP1BPOAV3XLF3Hg-q5-UbWCuBZWMXC2d3LT6C6S7EADPfVNKPHudawlQ2h2mcZUCRYmLAyGJtzjkBQ4fyVJixbQVkTEh3ltkKkOUjo0TdFpLCeo2ZnwW_znvvMONxOeU0-R6Y_0MTb_b6hqJYgqm1-xxm5ehlElu"
			// 		}
			// 	)
			// 	.post('/access_token', {
   //                client_id: '408b6ba64789e150dcc5',
   //                client_secret: 'd9fdacda313d9936f9e4382a8717b4f4087c2725',
   //                code: 'b012aeeb06102bc7c0cc',
   //                redirect_uri: 'http://localhost:3000/api/auth/github/callback'
   //              })
   //              .reply(200,{
   //              	'access_token' : 'e72e16c7e42f292c6912e7710c838347ae178b4a',
   //              	'scope' : 'user,email',
   //              	'token_type' : 'bearer'
   //              })
   //              .get('https://api.github.com/user?access_token=e72e16c7e42f292c6912e7710c838347ae178b4a')

			// 	.reply(200, recaptchaCorrectRespMock);


			// 	// getPartialNockApiUrl().reply(302, recaptchaCorrectRespMock);

	  //   		getPartialGetRequest(GITHUB_AUTH_URL)
			// 	//.set('XSRF-TOKEN', csrftoken)
			// 	//.send(contactMock)
			// 	.set('set-cookie', 'connect.sid=' + connectionSid)
	  //   		.set('set-cookie', 'XSRF-TOKEN=' + csrftoken)
			// 	.send()
			// 	.expect(302)
			// 	.end((err, res) => {
			// 		console.log(res.body);
			// 		// expect(res.body).to.be.equals(EMAIL);
			// 		done(err);
			// 	 //	done();
			// 	});
			// });

		});

	});
});