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

const SERVICENAME_NOT_VALID = 'Service name not valid';
const SERVICENAME_MUSTBE_STRING = 'Service name must be a String';
const USER_MUSTBE_OBJECT = 'User must be a valid object';

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

			it('should catch an exception, because serviceName is not valid', done => {	
				expect(()=>authCommon.removeServiceFromUserDb("not_whitelisted", {})).to.throw(SERVICENAME_NOT_VALID);
				done();
			});

			it('should catch an exception, because user must be a valid object', done => {
				expect(()=>authCommon.removeServiceFromUserDb("github", "")).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", -2)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", -1)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", -0)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", 0)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", 1)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", 2)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", null)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", undefined)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", function(){})).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", ()=>{})).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", /fooRegex/i)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", [])).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", new Error())).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", new RegExp(/fooRegex/,'i'))).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", new RegExp('/fooRegex/','i'))).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", new Date())).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", new Array())).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", true)).to.throw(USER_MUSTBE_OBJECT);
				expect(()=>authCommon.removeServiceFromUserDb("github", false)).to.throw(USER_MUSTBE_OBJECT);
				done();
			});

			it('should catch an exception, because serviceName must be a string', done => {	
				expect(()=>authCommon.removeServiceFromUserDb({}, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(-2, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(-1, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(-0, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(0, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(1, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(2, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(null, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(undefined, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(function(){}, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(()=>{}, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(/fooRegex/i, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb([], {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(new Error(), {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(new RegExp(/fooRegex/,'i'), {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(new RegExp('/fooRegex/','i'), {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(new Date(), {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(new Array(), {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(true, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				expect(()=>authCommon.removeServiceFromUserDb(false, {})).to.throw(SERVICENAME_MUSTBE_STRING);
				done();
			});
		});
	});
});