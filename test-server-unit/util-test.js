'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var _und = require('underscore');
var util = require('../app_server/utils/util');
var MockedRes = require('./mocked-res-class');
var mockedRes = new MockedRes();

describe('util', () => {

  const NOT_VALID_DATE = 'Not a valid date';
  const NOT_VALID_DECODEDJWT = 'Not a valid decodedJwtToken';
  const EXPIRE_DATE_NOT_FOUND = 'Expire date not found';
  const NOT_FLOAT_EXP_DATE = 'Not a float expiration date';
 
 describe('#sendJSONres()', () => {
    
    describe('---YES---', () => {
      it('should send a JSON response with content object and status 200', () => {
        const mockedObjContent = {
          prop1 : 'prop1',
          date1 : new Date(),
          obj1 : {
            message : 'random message'
          }
        };
        util.sendJSONres(mockedRes, 200, mockedObjContent);
        expect(mockedRes).to.be.not.null;
        expect(mockedRes).to.be.not.undefined;
        expect(mockedRes.getContentType()).to.be.equals('application/json');
        expect(mockedRes.getStatus()).to.be.equals(200);
        expect(mockedRes.getJson()).to.be.equals(mockedObjContent);
      });

      it('should send a JSON response with content object and status 200', () => {
        const mockedStringContent = 'string content';
        util.sendJSONres(mockedRes, 200, mockedStringContent);
        expect(mockedRes).to.be.not.null;
        expect(mockedRes).to.be.not.undefined;
        expect(mockedRes.getContentType()).to.be.equals('application/json');
        expect(mockedRes.getStatus()).to.be.equals(200);
        expect(mockedRes.getJson()).to.be.equals(mockedStringContent);
      });

      it('should send a JSON response with content object and status 300', () => {
        const mockedObjContent = {
          prop1 : 'prop1',
          date1 : new Date(),
          obj1 : {
            message : 'random message'
          }
        };
        util.sendJSONres(mockedRes, 300, mockedObjContent);
        expect(mockedRes).to.be.not.null;
        expect(mockedRes).to.be.not.undefined;
        expect(mockedRes.getContentType()).to.be.equals('application/json');
        expect(mockedRes.getStatus()).to.be.equals(300);
        expect(mockedRes.getJson()).to.be.equals(mockedObjContent);
      });

      it('should send a JSON response with content object and status 403', () => {
        const mockedObjContent = {
          prop1 : 'prop1',
          date1 : new Date(),
          obj1 : {
            message : 'random message'
          }
        };
        util.sendJSONres(mockedRes, 403, mockedObjContent);
        expect(mockedRes).to.be.not.null;
        expect(mockedRes).to.be.not.undefined;
        expect(mockedRes.getContentType()).to.be.equals('application/json');
        expect(mockedRes.getStatus()).to.be.equals(403);
        expect(mockedRes.getJson()).to.be.equals(mockedObjContent);
      });

      it('should send a JSON response with content object and status 403', () => {
        const mockedStringContent = 'string content';
        util.sendJSONres(mockedRes, 403, mockedStringContent);
        expect(mockedRes).to.be.not.null;
        expect(mockedRes).to.be.not.undefined;
        expect(mockedRes.getContentType()).to.be.equals('application/json');
        expect(mockedRes.getStatus()).to.be.equals(403);        
        expect(mockedRes.getJson().message).to.be.equals(mockedStringContent);
      });

      it('should send a JSON response with content Array and status 403', () => {
        const mockedStringArrayContent = ['string content', 'string content2'];
        util.sendJSONres(mockedRes, 403, mockedStringArrayContent);
        expect(mockedRes).to.be.not.null;
        expect(mockedRes).to.be.not.undefined;
        expect(mockedRes.getContentType()).to.be.equals('application/json');
        expect(mockedRes.getStatus()).to.be.equals(403);        
        expect(mockedRes.getJson().message).to.be.equals(mockedStringArrayContent);
      });
    });
    describe('---ERROR---', () => {
      it('should catch -status must be a valid and positive number-', () => {
        const mockedStringContent = 'string content';
        const STATUS_NUMBER = 'Status must be a valid http status code  number';
        expect(()=>util.sendJSONres(mockedRes, "not a num", mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, undefined, mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, null, mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, -1, mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, 5, mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, 99, mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, 600, mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, " ", mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, function(){}, mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, ()=>{}, mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, /fooRegex/i, mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, [], mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, new RegExp(/fooRegex/,'i'), mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, new RegExp('/fooRegex/','i'), mockedStringContent)).to.throw(STATUS_NUMBER);
        expect(()=>util.sendJSONres(mockedRes, new Error(), mockedStringContent)).to.throw(STATUS_NUMBER);
      });

      it('should catch -content must be either String, or Array, or Object-', () => {
        const CONTENT_CHECK = 'Content must be either String, or Array, or Object (no Error, RegExp, and so on )';
        expect(()=>util.sendJSONres(mockedRes, 200, undefined)).to.throw(CONTENT_CHECK);
        expect(()=>util.sendJSONres(mockedRes, 200, null)).to.throw(CONTENT_CHECK);
        expect(()=>util.sendJSONres(mockedRes, 200, -1)).to.throw(CONTENT_CHECK);
        expect(()=>util.sendJSONres(mockedRes, 200, 5)).to.throw(CONTENT_CHECK);
        expect(()=>util.sendJSONres(mockedRes, 200, function(){})).to.throw(CONTENT_CHECK);
        expect(()=>util.sendJSONres(mockedRes, 200, ()=>{})).to.throw(CONTENT_CHECK);
        expect(()=>util.sendJSONres(mockedRes, 200, /fooRegex/i)).to.throw(CONTENT_CHECK);
        expect(()=>util.sendJSONres(mockedRes, 200, new RegExp(/fooRegex/,'i'))).to.throw(CONTENT_CHECK);
        expect(()=>util.sendJSONres(mockedRes, 200, new RegExp('/fooRegex/','i'))).to.throw(CONTENT_CHECK);
        expect(()=>util.sendJSONres(mockedRes, 200, new Error())).to.throw(CONTENT_CHECK);
      });
    });
  });


  describe('#getTextFormattedDate()', () => {
    describe('---YES---', () => {
      it('should return the current formatted date as string', () => {
        const date = new Date();
        const day = date.getDay();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();

        const expected = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
        expect(util.getTextFormattedDate(date)).to.be.equal(expected);
      });

      it('should return the formatted date also for 1970', () => {
        const date = new Date(0);
        const day = date.getDay();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hour = date.getHours();
        const min = date.getMinutes();
        const sec = date.getSeconds();

        const expected = day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
        expect(util.getTextFormattedDate(date)).to.be.equal(expected);
      });
    });

    describe('---ERRORS---', () => {
      it('should catch -not a valid date- exception', () => {    

        expect(() => util.getTextFormattedDate("not a date")).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(undefined)).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(null)).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate("undefined")).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate("null")).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(-1)).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(1)).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(" ")).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(function(){})).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(()=>{})).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(/fooRegex/i)).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate([])).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(new Error())).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(new RegExp(/fooRegex/,'i'))).to.throw(NOT_VALID_DATE);
        expect(() => util.getTextFormattedDate(new RegExp('/fooRegex/','i'))).to.throw(NOT_VALID_DATE);
      });
    });
  });

  describe('#isJwtValidDate()', () => {
    var mockJwt, mockJwtNotFloat;
    var mockLocalUser;
    var dateExpire = new Date();

    before(() => {
      mockLocalUser = {
        email: 'fake@fake.com',
        name: 'fakeName',
        hash: 'fakeHash',
      };

      mockJwt = {
        _id : 'd435tergfg',
        user : mockLocalUser,
        exp : dateExpire
      };
    });

    function getJwtMockWithFloatDate (date) {
      mockJwt.exp = parseFloat(date.getTime()); //float date
      return mockJwt;
    }

    function getJwtMockNoFloatDate (date) {
      mockJwt.exp = date; //real date object, not a float
      return mockJwt;
    }

    describe('---YES---', () => {
      it('should return true, becase jwt is valid', () => {
        //valid for 10 minutes (10*60*1000)
        dateExpire.setTime(dateExpire.getTime() + 600000); 
        expect(util.isJwtValidDate(getJwtMockWithFloatDate(dateExpire))).to.equal(true);
      });
    });

    describe('---NO---', () => {
      it('should return false, becase jwt is expired', () => {
        //invalid because expired 10 minutes ago (10*60*1000)
        dateExpire.setTime(dateExpire.getTime() - 600000); 
        expect(util.isJwtValidDate(getJwtMockWithFloatDate(dateExpire))).to.equal(false);
      });

      it('should return false, becase jwt is expired exactly in this moment', () => {
        //invalid because expired 0 seconds ago
        dateExpire.setTime(dateExpire.getTime()); 
        expect(util.isJwtValidDate(getJwtMockWithFloatDate(dateExpire))).to.equal(false);
      });
    });

    describe('---ERRORS---', () => {
      it('should catch -not a float expiration date- exception', () => {
        //date must be a float into the jwt token and not a Date's object
        expect(() => util.isJwtValidDate(getJwtMockNoFloatDate(dateExpire))).to.throw(NOT_FLOAT_EXP_DATE);
        //TODO FIXME improve adding other test, to be sure that it will work also 
        //passing null, undefined and so on :) 
        //I know that it won't work :( -> update util.js
      });

      it('should catch -not a valid decodedJwtToken- exception', () => {
        //invalid token
        expect(() => util.isJwtValidDate(undefined)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(null)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(-5)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(-1)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(-0)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(0)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(1)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(2)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate("")).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate("undefined")).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate("null")).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(" ")).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(function(){})).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(()=>{})).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate([])).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(new Error())).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(/fooRegex/i)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(new RegExp(/fooRegex/,'i'))).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(new RegExp('/fooRegex/','i'))).to.throw(NOT_VALID_DECODEDJWT);
      });

      it('should catch -expire date not found- exceptions', () => {
        //expire date not found into decodedJwtToken
        delete mockJwt.exp;
        expect(() => util.isJwtValidDate(mockJwt)).to.throw(EXPIRE_DATE_NOT_FOUND);
      });
    });
  });
});