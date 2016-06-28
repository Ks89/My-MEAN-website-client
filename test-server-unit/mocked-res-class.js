'use strict';
//this class simulate/mock the response (res) for sendJSONres int util.js
var statusVar = null;
var contentTypeVar = null;
var contentVal = null;
class MockedRes {
  constructor(){}
  status(val) {
		statusVar = val;
  }
  contentType(val) {
    contentTypeVar = val;
  }
  json(val) {
    contentVal = val;
  }

  getStatus() {
    return statusVar;
  }
  getContentType() {
    return contentTypeVar;
  }
  getJson() {
    return contentVal;
  }
}
module.exports = MockedRes;