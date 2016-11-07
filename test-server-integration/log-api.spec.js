'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);

//useful function that prevent to copy and paste the same code
function getPartialPostRequest (apiUrl) {
  return agent
    .post(apiUrl)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json');
}

const DEBUG_LOGGED = "debug logged on server";
const ERROR_LOGGED = "error logged on server";
const EXCETION_LOGGED = "Exception logged on server";

const bodyMock = { "message" : "message to log" };
const bodyNoMessageMock = { "something": "something useless" }; // no "message" field
const bodyExceptionMock = {
  errorUrl: "http://localhost/fake url",
  errorMessage: "dsadasdasd",
  cause: ( "cause" || "" )
};

describe('log-api', () => {
  describe('---YES---', () => {
    it('should correctly log a debug message', done => {
      getPartialPostRequest('/api/log/debug')
      .send(bodyMock)
      .expect(200)
      .end((err, res) => {
        expect(res.body.info).to.equal(DEBUG_LOGGED);
        expect(res.body.body.message).to.equal(bodyMock.message);
        done(err);
      });
    });

    it('should correctly log a debug message, also if message is undefined', done => {
      getPartialPostRequest('/api/log/debug')
      .send(bodyNoMessageMock)
      .expect(200)
      .end((err, res) => {
        expect(res.body.info).to.equal(DEBUG_LOGGED);
        expect(res.body.body.message).to.be.undefined;
        done(err);
      });
    });

    it('should correctly log an error message', done => {
      getPartialPostRequest('/api/log/error')
      .send(bodyMock)
      .expect(200)
      .end((err, res) => {
        expect(res.body.info).to.equal(ERROR_LOGGED);
        expect(res.body.body.message).to.equal(bodyMock.message);
        done(err);
      });
    });

    it('should correctly log an error message, also if message is undefined', done => {
      getPartialPostRequest('/api/log/error')
      .send(bodyNoMessageMock)
      .expect(200)
      .end((err, res) => {
        expect(res.body.info).to.equal(ERROR_LOGGED);
        expect(res.body.body.message).to.be.undefined;
        done(err);
      });
    });

    it('should correctly log an exception message', done => {
      getPartialPostRequest('/api/log/exception')
      .send(bodyExceptionMock)
      .expect(200)
      .end((err, res) => {
        expect(res.body.info).to.equal(EXCETION_LOGGED);
        expect(res.body.body.errorUrl).to.equal(bodyExceptionMock.errorUrl);
        expect(res.body.body.errorMessage).to.equal(bodyExceptionMock.errorMessage);
        expect(res.body.body.cause).to.equal(bodyExceptionMock.cause);
        done(err);
      });
    });
  });
});
