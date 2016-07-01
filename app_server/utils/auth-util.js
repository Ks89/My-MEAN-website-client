var _und = require('underscore');
var jwt = require('jsonwebtoken');
var whitelistServices = require('../controllers/authentication/serviceNames');

class AuthUtils {

  constructor(){}

  static checkIfLastUnlink(serviceName, user) {
    if(!user) {
      throw 'User must be a valid object';
    }

    if(!_und.isString(serviceName)) {
      throw 'serviceName must be a String';
    }

    if(whitelistServices.indexOf(serviceName) === -1) {
      console.log('Service name not recognized in checkIfLastUnlink');
      return false;
    }

    let result = false;
    let checkProp;
    //I remove serviceName from whitelistServices
    const filteredServices = _und.without(whitelistServices, serviceName);
    
    for(let service of filteredServices) {
      if(service === 'local') {
        checkProp = 'email';
      } else {
        checkProp = 'id';
      }

      //something like !user.facebook.id or !user.local.email and so on
      result = !user[service][checkProp];

      if(!result) {
        console.log("breaking....");
        break;
      }
    }

    return result;
  }

  static removeServiceFromUserDb(serviceName, user) {
    if(!user || _und.isString(user) ||
        !_und.isObject(user) || _und.isArray(user) || 
        _und.isFunction(user) || _und.isRegExp(user) ||
        _und.isError(user) || _und.isNull(user) || _und.isBoolean(user) ||
        _und.isUndefined(user) || _und.isNaN(user) || _und.isDate(user)) {
      throw 'User must be a valid object';
    }

    if(!_und.isString(serviceName)) {
      throw 'Service name must be a String';
    }

    if(whitelistServices.indexOf(serviceName) !== -1) {
      user[serviceName] = undefined;
    } else {
      throw 'Service name not valid';
    }
    return user;
  }
}

module.exports = AuthUtils;