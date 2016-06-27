'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var chai = require('chai');
var expect = chai.expect;
var _und = require('underscore');

require('../app_server/models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var authCommon = require('../app_server/controllers/authentication/common/auth-common');

const FAKE = 'fake';
const WRONG_SERVICE_NAME = 'wrong';

const SERVICENAME_NOT_FOUND = 'Service name to remove from user not recognized';

describe('auth-common', () => {

	describe('#removeServiceFromUserDb()', () => {
		describe('---YES---', () => {

			const userMocks = [
				{serviceName:'local', user: {local:{email:FAKE},github:{},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'github', user: {local:{},github:{id:FAKE},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'google', user: {local:{},github:{},google:{id:FAKE},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'facebook', user: {local:{},github:{},google:{},facebook:{id:FAKE},twitter:{},linkedin:{}} },
				{serviceName:'twitter', user: {local:{},github:{},google:{},facebook:{},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'linkedin', user: {local:{},github:{},google:{},facebook:{},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'local', user: {local:{},github:{},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'github', user: {local:{},github:{},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'google', user: {local:{},github:{},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'facebook', user: {local:{},github:{},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'twitter', user: {local:{},github:{},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'linkedin', user: {local:{},github:{},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'local', user: {github:{},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'github', user: {twitter:{},linkedin:{}} },
				{serviceName:'google', user: {linkedin:{}} },
				{serviceName:'local', user: {}}

				//TODO add all the cases here
			];

			for(let i=0; i<userMocks.length; i++) {
				console.log("userMocks[" + i + "]", userMocks[i]);
				it('should return true, because it removes the specified service. Test i=' + i, done => {
					var removed = authCommon.removeServiceFromUserDb(userMocks[i].serviceName, userMocks[i].user);
					console.log(removed);

					if(userMocks[i].serviceName !== 'local') expect(removed.local).to.be.equals(userMocks[i].user.local);
					if(userMocks[i].serviceName !== 'facebook') expect(removed.facebook).to.be.equals(userMocks[i].user.facebook);
					if(userMocks[i].serviceName !== 'google') expect(removed.google).to.be.equals(userMocks[i].user.google);
					if(userMocks[i].serviceName !== 'github') expect(removed.github).to.be.equals(userMocks[i].user.github);
					if(userMocks[i].serviceName !== 'twitter') expect(removed.twitter).to.be.equals(userMocks[i].user.twitter);
					if(userMocks[i].serviceName !== 'linkedin') expect(removed.linkedin).to.be.equals(userMocks[i].user.linkedin);

					expect(removed[userMocks[i].serviceName]).to.be.undefined;

					done();
				});
			}
		});


		describe('---ERRORS---', () => { 

			it('should catch an exception, because the serviceName cannot be found inside the user object', done => {
				
				expect(()=>authCommon.removeServiceFromUserDb(null, {})).to.throw(SERVICENAME_NOT_FOUND);

				done();
			});


		});
	});
});