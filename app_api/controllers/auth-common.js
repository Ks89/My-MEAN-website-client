var logger = require('../utils/logger.js');

var jwt = require('jsonwebtoken');

var Utils = require('../utils/util.js');
var utils = new Utils();

/* GET to decode a JWT passing the token itself*/
/* /api/decodeToken/:token */
module.exports.decodeToken = function(req, res) {
  console.log('decodetoken', req.params);
  if (req.params && req.params.token) {

    var token = req.params.token;
    console.log("data received jwt: " + token);

    // verify a token symmetric
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if(err) {
        console.log("ERROR");
        utils.sendJSONresponse(res, 404, null);
      } 

      if(decoded) {
        console.log("decoding...");
        console.log(decoded);
        var convertedDate = new Date();
        convertedDate.setTime(decoded.exp);
        
        console.log("date jwt: " + convertedDate.getTime() +
          ", formatted: " + utils.getTextFormattedDate(convertedDate));
        
        var systemDate = new Date();
        console.log("systemDate: " + systemDate.getTime() + 
          ", formatted: " + utils.getTextFormattedDate(systemDate));

        if( convertedDate.getTime() > systemDate.getTime() ) {
          console.log("systemDate valid");
          console.log("stringifying...");
          console.log(JSON.stringify(decoded));
          utils.sendJSONresponse(res, 200, JSON.stringify(decoded));
        } else {
          console.log('No data valid');
          utils.sendJSONresponse(res, 404, "invalid-data");
        }
      }
    });
  } else {
    console.log('No token found');
    utils.sendJSONresponse(res, 404, null);
  }
};


/* GET to logout removing session data stored in Redis */
/* /api/logout */
module.exports.logout = function(req, res) {
  console.log('logout called');
  console.log('data available (authToken): ' + req.session.authToken);
  if(req.session.authToken) {
    req.session.destroy(function(){
      console.log('Session data destroyed');
      utils.sendJSONresponse(res, 200, {});
    });
  } else {
    console.log('Authtoken not available as session data in Redis, for instance you aren\'t logged');
    utils.sendJSONresponse(res, 404, null);
  }
};

/* GET to obtain the sessionToken stored in Redis */
/* /api/sessionToken */
module.exports.sessionToken = function(req, res) {
  console.log('sessionToken called');
  console.log('data available (authToken): ' + req.session.authToken);
  if(req.session.authToken) {
    utils.sendJSONresponse(res, 200, req.session.authToken);
  } else {
    console.log('Authtoken not available as session data in Redis, for instance you aren\'t logged');
    utils.sendJSONresponse(res, 404, null);
  }
};