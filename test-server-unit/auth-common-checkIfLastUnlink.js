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

describe('auth-common', () => {

	describe('#checkIfLastUnlink()', () => {
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
				{serviceName:'linkedin', user: {local:{},github:{},google:{},facebook:{},twitter:{},linkedin:{}} }
			];

			for(let i=0; i<userMocks.length; i++) {
				console.log("userMocks[" + i + "]", userMocks[i]);
				it('should return true, because it\'s a lastUnlink. Test i=' + i, done => {
					var lastUnlink = authCommon.checkIfLastUnlink(userMocks[i].serviceName, userMocks[i].user);
					expect(lastUnlink).to.be.true;
					done();
				});
			}
		});

		describe('---NO---', () => {

			const userWrongMocks = [
				{serviceName:'local', user: {local:{email:FAKE},github:{id:FAKE},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'local', user: {local:{email:FAKE},github:{},google:{id:FAKE},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'local', user: {local:{email:FAKE},github:{},google:{},facebook:{id:FAKE},twitter:{},linkedin:{}} },
				{serviceName:'local', user: {local:{email:FAKE},github:{},google:{},facebook:{},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'local', user: {local:{email:FAKE},github:{},google:{},facebook:{},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'local', user: {local:{email:FAKE},github:{id:FAKE},google:{},facebook:{id:FAKE},twitter:{},linkedin:{}} },
				{serviceName:'local', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'local', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{id:FAKE}} },

				{serviceName:'github', user: {local:{},github:{id:FAKE},google:{id:FAKE},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'github', user: {local:{},github:{id:FAKE},google:{},facebook:{id:FAKE},twitter:{},linkedin:{}} },
				{serviceName:'github', user: {local:{},github:{id:FAKE},google:{},facebook:{},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'github', user: {local:{},github:{id:FAKE},google:{},facebook:{},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'github', user: {local:{email:FAKE},github:{id:FAKE},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'github', user: {local:{},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{},linkedin:{}} },
				{serviceName:'github', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'github', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{id:FAKE}} },

				{serviceName:'google', user: {local:{},github:{id:FAKE},google:{id:FAKE},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'google', user: {local:{},github:{},google:{id:FAKE},facebook:{id:FAKE},twitter:{},linkedin:{}} },
				{serviceName:'google', user: {local:{},github:{},google:{id:FAKE},facebook:{},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'google', user: {local:{},github:{},google:{id:FAKE},facebook:{},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'google', user: {local:{email:FAKE},github:{},google:{},facebook:{},twitter:{},linkedin:{}} },
				{serviceName:'google', user: {local:{},github:{},google:{id:FAKE},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'google', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'google', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{id:FAKE}} },

				{serviceName:'facebook', user: {local:{},github:{id:FAKE},google:{},facebook:{id:FAKE},twitter:{},linkedin:{}} },
				{serviceName:'facebook', user: {local:{},github:{},google:{id:FAKE},facebook:{id:FAKE},twitter:{},linkedin:{}} },
				{serviceName:'facebook', user: {local:{},github:{},google:{},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'facebook', user: {local:{},github:{},google:{},facebook:{id:FAKE},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'facebook', user: {local:{email:FAKE},github:{},google:{},facebook:{id:FAKE},twitter:{},linkedin:{}} },
				{serviceName:'facebook', user: {local:{},github:{id:FAKE},google:{},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'facebook', user: {local:{email:FAKE},github:{id:FAKE},google:{},facebook:{id:FAKE},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'facebook', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{id:FAKE}} },

				{serviceName:'twitter', user: {local:{},github:{id:FAKE},google:{},facebook:{},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'twitter', user: {local:{},github:{},google:{id:FAKE},facebook:{},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'twitter', user: {local:{},github:{},google:{},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'twitter', user: {local:{},github:{},google:{},facebook:{},twitter:{id:FAKE},linkedin:{id:FAKE}} },
				{serviceName:'twitter', user: {local:{email:FAKE},github:{},google:{},facebook:{},twitter:{id:FAKE},linkedin:{}} },
				{serviceName:'twitter', user: {local:{},github:{},google:{},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{id:FAKE}} },
				{serviceName:'twitter', user: {local:{email:FAKE},github:{id:FAKE},google:{},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{id:FAKE}} },
				{serviceName:'twitter', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{id:FAKE}} },

				{serviceName:'linkedin', user: {local:{},github:{id:FAKE},google:{},facebook:{},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'linkedin', user: {local:{},github:{},google:{id:FAKE},facebook:{},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'linkedin', user: {local:{},github:{},google:{},facebook:{id:FAKE},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'linkedin', user: {local:{},github:{},google:{},facebook:{},twitter:{id:FAKE},linkedin:{id:FAKE}} },
				{serviceName:'linkedin', user: {local:{email:FAKE},github:{},google:{},facebook:{},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'linkedin', user: {local:{},github:{},google:{},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{id:FAKE}} },
				{serviceName:'linkedin', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{},linkedin:{id:FAKE}} },
				{serviceName:'linkedin', user: {local:{email:FAKE},github:{id:FAKE},google:{id:FAKE},facebook:{id:FAKE},twitter:{id:FAKE},linkedin:{id:FAKE}} }
			];

			for(let i=0; i<userWrongMocks.length; i++) {
				console.log("userWrongMocks[" + i + "]", userWrongMocks[i]);
				it('should return false, because it\'s not a last unlink. Test i=' + i , done => {
					var lastUnlink = authCommon.checkIfLastUnlink(userWrongMocks[i].serviceName, userWrongMocks[i].user);
					expect(lastUnlink).to.be.false;
					done();
				});
			}
			it('should return false, because this serviceName is not recognized', done => {
				var lastUnlink = authCommon.checkIfLastUnlink(WRONG_SERVICE_NAME, {});
				expect(lastUnlink).to.be.false;
				done();
			});
		});
	});
});