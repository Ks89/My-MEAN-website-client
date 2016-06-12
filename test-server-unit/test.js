var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var _und = require('underscore');

var rewire = require("rewire");
var logger = rewire('../app_server/controllers/logger');
 
describe('logger', () => {

describe('---YES---', () => {
      it('should return the current formatted date as string', () => {
      	
		logger.__get__("log"); // = '/dev/null' 

      });

  });
});