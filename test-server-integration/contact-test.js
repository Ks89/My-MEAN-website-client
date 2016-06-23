'user strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);
var nock = require('nock');

var csrftoken;
var connectionSid;

const RECAPTCHA_BASE_URL = 'https://www.google.com/recaptcha';
const RECAPTCHA_API_URL = '/api/siteverify';
const EMAIL_URL = '/api/email';

const RESPONSE = 'random_data';
const EMAIL = 'fake@fake.it';
const OBJECT = 'useless email';
const MESSAGE = 'some random words';

const contactMock = {
	response: RESPONSE,
    emailFormData: {
    	email: EMAIL,
    	object: OBJECT,
    	messageText: MESSAGE
    }
};

const recaptchaCorrectRespMock = {
	success: true,
	challenge_ts: "2016-06-22T22:59:40Z",
	hostname: "localhost"
};

const recaptchaWrong1RespMock = {
	success: false,
	challenge_ts: "2016-06-22T22:59:40Z",
	hostname: "localhost"
};

const recaptchaWrong2RespMock = {
	success: false,
	challenge_ts: "2016-06-22T22:59:40Z",
	hostname: "localhost",
	'error-codes': ['some-error1', 'another-error']
};

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

	function getPartialNockApiUrl () {
		return nock(RECAPTCHA_BASE_URL)
				.post(RECAPTCHA_API_URL);
	}

	describe('#sendEmailWithRecaptcha()', () => {
		
		describe('---YES---', () => {

			beforeEach(done => updateCookiesAndTokens(done));

			it('should correctly send an email', done => {
				getPartialNockApiUrl().reply(200, recaptchaCorrectRespMock);
	    		getPartialPostRequest(EMAIL_URL)
				.set('XSRF-TOKEN', csrftoken)
				.send(contactMock)
				.expect(200)
				.end((err, res) => {
					if (!err) {
						expect(res.body).to.be.equals(EMAIL);
					}
					done(err);
				});
			});
		});


		describe('---NO---', () => {

			beforeEach(done => updateCookiesAndTokens(done));

			it('should catch a 401 UNAUTHORIZED, because Recaptcha2 answers false', done => {
				getPartialNockApiUrl().reply(200, recaptchaWrong1RespMock);
	    		getPartialPostRequest(EMAIL_URL)
				.set('XSRF-TOKEN', csrftoken)
				.send(contactMock)
				.expect(401)
				.end((err, res) => {
					if (!err) {
						expect(res.body.message).to.be.equals('Recaptcha verify answered FALSE!');
					}
					done(err);
				});
			});

			it('should catch a 401 UNAUTHORIZED, because Recaptcha2 answers false also with an array of error codes', done => {
				getPartialNockApiUrl().reply(200, recaptchaWrong2RespMock);
	    		getPartialPostRequest(EMAIL_URL)
				.set('XSRF-TOKEN', csrftoken)
				.send(contactMock)
				.expect(401)
				.end((err, res) => {
					if (!err) {
						expect(res.body.message[0]).to.be.equals('some-error1');
						expect(res.body.message[1]).to.be.equals('another-error');
					}
					done(err);
				});
			});


			const missingEmailFormData = [
				{email: EMAIL, object: OBJECT, messageText: MESSAGE},
				{email: EMAIL, messageText: MESSAGE},
				{email: EMAIL, object: OBJECT},
				{object: OBJECT, messageText: MESSAGE},
				{email: EMAIL},
				{object: OBJECT},
				{messageText: MESSAGE},
				{}
			];
			const missingContactMocks = [
				{response: RESPONSE, emailFormData: missingEmailFormData[0]},
				{response: RESPONSE, emailFormData: missingEmailFormData[1]},
				{response: RESPONSE, emailFormData: missingEmailFormData[2]},
				{response: RESPONSE, emailFormData: missingEmailFormData[3]},
				{response: RESPONSE, emailFormData: missingEmailFormData[4]},
				{response: RESPONSE, emailFormData: missingEmailFormData[5]},
				{response: RESPONSE, emailFormData: missingEmailFormData[6]},
				{response: RESPONSE},
				{}
			];

			//these are multiple tests that I'm execting for all cobinations
			//of missing params
			for(let i = 0; i<missingContactMocks.length; i++) {
				console.log(missingContactMocks[i]);

				it('should catch a 400 BAD REQUEST, because subject, object and text params are mandatory. Test i=' + i, done => {
					getPartialNockApiUrl().reply(200, recaptchaCorrectRespMock);
					
					//remove imput params
					delete contactMock.emailFormData;

		    		getPartialPostRequest(EMAIL_URL)
					.set('XSRF-TOKEN', csrftoken)
					.send(contactMock)
					.expect(400)
					.end((err, res) => {
						if (!err) {
							expect(res.body.message).to.be.equals('Missing input params');	
						}
						done(err);
					});
				});
			}
		});
		
		describe('---ERRORS---', () => {
			it('should get 403 FORBIDDEN,, because XSRF-TOKEN is not available', done => {
				getPartialPostRequest(EMAIL_URL)
				//XSRF-TOKEN NOT SETTED!!!!
				.send(contactMock)
				.expect(403)
				.end(() => done());
			});
		});
	});
});