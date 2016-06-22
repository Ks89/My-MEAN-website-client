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

var NEW_NAME = 'Fake name';
var NEW_EMAIL = 'fake@email.com';
var NEW_PASSWORD = 'Password2';

const EMAIL_URL = '/api/email';

const contactMock = {
	response: 'random_data',
    emailFormData: {
    	email: 'fake@fake.it',
    	object: 'useless email',
    	messageText: 'some random words'
    }
};

describe('contac', () => {

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

	describe('#sendEmailWithRecaptcha()', () => {
		
		describe('---YES---', () => {

			beforeEach(done => updateCookiesAndTokens(done));

			it('should correctly send an email', done => {
	    		getPartialPostRequest(EMAIL_URL)
				.set('XSRF-TOKEN', csrftoken)
				.send(contactMock)
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err);
					} else {
						console.log(res.body);
						// expect(res.body.message).to.be.equals("User with email "  + registerMock.email + " registered.");
						done();
					}
				});
			});
		});
		
		describe('---ERRORS---', () => {
			it('should get 403 FORBIDDEN, because XSRF-TOKEN is not available', done => {
				getPartialPostRequest(EMAIL_URL)
				//XSRF-TOKEN NOT SETTED!!!!
				.send(contactMock)
				.expect(403)
				.end(() => done());
			});
		});
	});
});