var _und = require('underscore');

class Utils {

  constructor(){}

  static sendJSONresponse(res, status, content) {
		res.status(status);
		res.contentType('application/json');
		res.json(content);
  }

  static getTextFormattedDate(date) {
    console.log("getTextFormattedDate " + date);
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
    console.log("isJwtValidDate " + decodedJwtToken);

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

    //decodedJwtToken.exp is a Float that represents the exp date
    //it must be a float, and not a Date 
    if(_und.isDate(decodedJwtToken.exp)) {
      throw "Not a float expiration date";
    }

    //TODO FIXME add a check to be sure that decodedJwtToken.exp can be converted into a date

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