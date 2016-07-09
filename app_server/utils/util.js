var _und = require('underscore');
var jwt = require('jsonwebtoken');
var logger = require('./logger');

class Utils {

  constructor(){}

  static sendJSONres(res, status, content) {
    let contentToReturn;

    //check status param
    if(!_und.isNumber(status) || _und.isNaN(status) || status < 100 || status >= 600) {
      throw "Status must be a valid http status code  number";
    }

    //check content param
    //because content can be only String, Array, Object (but no all of the others)
    if((!_und.isString(content) && !_und.isArray(content) && !_und.isObject(content)) ||
      _und.isRegExp(content) || _und.isFunction(content) || _und.isDate(content) ||
      _und.isBoolean(content) || _und.isError(content) || _und.isNull(content) ||
      _und.isUndefined(content) || _und.isNaN(content) || _und.isNumber(content)) {
      throw "Content must be either String, or Array, or Object (no Error, RegExp, and so on )";
    }

    res.status(status);
    res.contentType('application/json');
    
    if(status >= 400 && status < 600) {
      if(_und.isString(content) || _und.isArray(content)) {
        contentToReturn = { 
          message : content
        };
      } else {
        contentToReturn = content;
      }
    } else {
      contentToReturn = content;
    }
    res.json(contentToReturn);
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
        !_und.isObject(decodedJwtToken) || _und.isArray(decodedJwtToken) || 
        _und.isFunction(decodedJwtToken) || _und.isRegExp(decodedJwtToken) ||
        _und.isError(decodedJwtToken) || _und.isNull(decodedJwtToken) ||
        _und.isUndefined(decodedJwtToken) || _und.isNaN(decodedJwtToken) ||
        _und.isBoolean(decodedJwtToken)) {
      throw "Not a valid decodedJwtToken";
    }

    if(!decodedJwtToken.hasOwnProperty('exp')) {
      throw "Expire date not found";
    }

    //decodedJwtToken.exp is a Float that represents the exp date
    //it must be a float, and not a Date 
    //NB: parseFloat returns NaN if it can't parse a value
    if(_und.isDate(decodedJwtToken.exp) || _und.isNaN(parseFloat(decodedJwtToken.exp))) {
      throw "Not a float expiration date";
    }

    let convertedDate = new Date();
    convertedDate.setTime(decodedJwtToken.exp);

    try {
      console.log("date jwt: " + convertedDate.getTime() +
         ", formatted: " + this.getTextFormattedDate(convertedDate));

      const systemDate = new Date();
      console.log("systemDate: " + systemDate.getTime() + 
         ", formatted: " + this.getTextFormattedDate(systemDate));

      return convertedDate.getTime() > systemDate.getTime();
    } catch(e) {
      //impossible to get dates to compare
      //I decide to return false
      logger.error(e);
      return false;
    }
  }

  static isJwtValid(token) {
    var self = this;

    if(!token || !_und.isString(token) ||
        _und.isObject(token) || _und.isArray(token) || 
        _und.isFunction(token) || _und.isRegExp(token) ||
        _und.isError(token) || _und.isNull(token) ||
        _und.isUndefined(token) || _und.isNaN(token)) {
      throw "Not a valid token";
    }

    return new Promise((resolve, reject) => {
      // verify a token symmetric
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
          console.log("jwt.verify error");
          reject({status: 401, message: "Jwt not valid or corrupted"});
        } 

        if(decoded) {
          console.log("decoded valid");
          try {
            if(self.isJwtValidDate(decoded)) {
              console.log("systemDate valid");
              console.log("stringifying...");
              console.log(JSON.stringify(decoded));
              resolve(decoded);
            } else {
              console.log('Token Session expired (date).');
              reject({status: 401, message: "Token Session expired (date)."});
            }
          } catch(e) {
            logger.error(e.message);
            reject({status: 500, message: "Impossible to check if jwt is valid"});
          }
        } else {
          console.log('Impossible to decode token.');
          reject({status: 401, message: "Impossible to decode token."});
        }
      });
    });
  }

}

module.exports = Utils;