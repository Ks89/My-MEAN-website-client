'use strict';

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var _und = require('underscore');
var util = require('../app_server/utils/util');

describe('util', () => {

  const NOT_VALID_DATE = 'Not a valid date';
  const NOT_VALID_DECODEDJWT = 'Not a valid decodedJwtToken';
  const EXPIRE_DATE_NOT_FOUND = 'Expire date not found';
  const NOT_FLOAT_EXP_DATE = 'Not a float expiration date';
 
  describe('#getTextFormattedDate()', () => {
    describe('---YES---', () => {
      it('should return the current formatted date as string', function () {
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

      it('should return the formatted date also for 1970', function () {
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
      it('should catch -not a valid date- exception', function () {    

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
      it('should return true, becase jwt is valid', function () {
        //valid for 10 minutes (10*60*1000)
        dateExpire.setTime(dateExpire.getTime() + 600000); 
        expect(util.isJwtValidDate(getJwtMockWithFloatDate(dateExpire))).to.equal(true);
      });
    });

    describe('---NO---', () => {
      it('should return false, becase jwt is expired', function () {
        //invalid because expired 10 minutes ago (10*60*1000)
        dateExpire.setTime(dateExpire.getTime() - 600000); 
        expect(util.isJwtValidDate(getJwtMockWithFloatDate(dateExpire))).to.equal(false);
      });

      it('should return false, becase jwt is expired exactly in this moment', function () {
        //invalid because expired 0 seconds ago
        dateExpire.setTime(dateExpire.getTime()); 
        expect(util.isJwtValidDate(getJwtMockWithFloatDate(dateExpire))).to.equal(false);
      });
    });

    describe('---ERRORS---', () => {
      it('should catch -not a float expiration date- exception', function () {
        //date must be a float into the jwt token and not a Date's object
        expect(() => util.isJwtValidDate(getJwtMockNoFloatDate(dateExpire))).to.throw(NOT_FLOAT_EXP_DATE);
        //TODO FIXME improve adding other test, to be sure that it will work also 
        //passing null, undefined and so on :) 
        //I know that it won't work :( -> update util.js
      });

      it('should catch -not a valid decodedJwtToken- exception', function () {
        //invalid token
        expect(() => util.isJwtValidDate(undefined)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(null)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(0)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(-1)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(1)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(-0)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(2)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(-5)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate("")).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate("undefined")).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate("null")).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(" ")).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(function(){})).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(()=>{})).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(/fooRegex/i)).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(new RegExp(/fooRegex/,'i'))).to.throw(NOT_VALID_DECODEDJWT);
        expect(() => util.isJwtValidDate(new RegExp('/fooRegex/','i'))).to.throw(NOT_VALID_DECODEDJWT);
      });

      it('should catch -expire date not found- exceptions', function () {
        //expire date not found into decodedJwtToken
        delete mockJwt.exp;
        expect(() => util.isJwtValidDate(mockJwt)).to.throw(EXPIRE_DATE_NOT_FOUND);
      });
    });
  });
});