var _ = require('lodash');
var jwt = require('jsonwebtoken');
var logger = require('./logger');

class Utils {

  constructor(){}

  static sendJSONres(res, status, content) {
    let contentToReturn;

    //check status param
    if(!_.isNumber(status) || _.isNaN(status) || status < 100 || status >= 600) {
      throw "Status must be a valid http status code  number";
    }

    //check content param
    //because content can be only String, Array, Object (but no all of the others)
    if((!_.isString(content) && !_.isArray(content) && !_.isObject(content)) ||
      _isNotAcceptableValue(content) || _.isDate(content) || _.isBoolean(content) ||
      _.isNumber(content)) {
      throw "Content must be either String, or Array, or Object (no Error, RegExp, and so on )";
    }

    res.status(status);
    res.contentType('application/json');

    if(status >= 400 && status < 600) {
      if(_.isString(content) || _.isArray(content)) {
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
    if(!_.isDate(date)) {
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

    //Function that returns true if the param
  // is not a custom Object (neither an array, or an error, or a function, or null, or
  // undefined, or a boolean, or nan)
  // false otherwise
  //isObject: JavaScript arrays and functions
  //          are objects, while (normal) strings and numbers are not.
  static isNotSimpleCustomObject(obj) {
    return !_.isObject(obj) || _.isArray(obj) ||
        _isNotAcceptableValue(obj) || _.isBoolean(obj);
  }

  static isNotSimpleCustomObjectOrDate(obj) {
    return !_.isObject(obj) || _.isArray(obj) ||
        _isNotAcceptableValue(obj) || _.isBoolean(obj) || _.isDate(obj);
  }

  static isJwtValidDate(decodedJwtToken) {
    console.log("isJwtValidDate");
    console.log(decodedJwtToken);

    //isObject: JavaScript arrays and functions
    //          are objects, while (normal) strings and numbers are not.
    if(!decodedJwtToken ||
        !_.isObject(decodedJwtToken) || _.isArray(decodedJwtToken) ||
        _isNotAcceptableValue(decodedJwtToken) || _.isBoolean(decodedJwtToken)) {
      throw "Not a valid decodedJwtToken";
    }

    if(!decodedJwtToken.hasOwnProperty('exp')) {
      throw "Expire date not found";
    }

    //decodedJwtToken.exp is a Float that represents the exp date
    //it must be a float, and not a Date
    //NB: parseFloat returns NaN if it can't parse a value
    if(_.isDate(decodedJwtToken.exp) || _.isNaN(parseFloat(decodedJwtToken.exp))) {
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

    if(!token || !_.isString(token) ||
        _.isObject(token) || _.isArray(token) ||
        _isNotAcceptableValue(token)) {
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

  // This method returns true if the parameter is NOT acceptable, i.e.
  // is a function OR
  // is a RegExp OR
  // is an Error OR
  // is null OR
  // is undefined OR
  // is NaN;
  // false otherwise.
  static isNotAcceptableValue(param) {
    return _isNotAcceptableValue(param);
  }

  static isAcceptableValue(param) {
    return _isAcceptableValue(param);
  }
}

// private functions that I can call inside this class.
// Also, I exposed these functions using two static methods (without `_`)
function _isNotAcceptableValue(param) {
  return _.isFunction(param) || _.isRegExp(param) ||
  _.isError(param) || _.isNull(param) ||
  _.isUndefined(param) || _.isNaN(param);
}

function _isAcceptableValue(param) {
  return !_isNotAcceptableValue(param);
}

module.exports = Utils;
