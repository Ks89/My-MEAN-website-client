var _und = require('underscore');

class Utils {

  constructor(){}

  static sendJSONresponse(res, status, content) {
		res.status(status);
		res.contentType('application/json');
		res.json(content);
  }

  static getTextFormattedDate(date) {
    if(!_und.isDate(date)) {
      throw "Not a valid date";
    }
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
  }

  static isJwtValidDate(decodedJwtToken) {

    //isObject: JavaScript arrays and functions 
    //          are objects, while (normal) strings and numbers are not.

    if(!decodedJwtToken || 
        !_und.isObject(decodedJwtToken) ||
        _und.isArray(decodedJwtToken) || 
        _und.isFunction(decodedJwtToken) ||
        _und.isRegExp(decodedJwtToken)) {
      throw "Not a valid decodedJwtToken";
    }

    if(!decodedJwtToken.hasOwnProperty('exp')) {
      throw "Expire date not found";
    }

    if(!_und.isDate(decodedJwtToken.exp)) {
      throw "Not a valid date";
    }

    let convertedDate = new Date();
    convertedDate.setTime(decodedJwtToken.exp);

    console.log("date jwt: " + convertedDate.getTime() +
       ", formatted: " + this.getTextFormattedDate(convertedDate));

    const systemDate = new Date();
    console.log("systemDate: " + systemDate.getTime() + 
       ", formatted: " + this.getTextFormattedDate(systemDate));

    return convertedDate.getTime() > systemDate.getTime();
  }
}

module.exports = Utils;