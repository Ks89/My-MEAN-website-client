var jwt = require('jsonwebtoken');

var logger = require('../utils/logger.js');
var Utils = require('../utils/util.js');

module.exports.restAuthenticationMiddleware = function(req, res, next) {
	logger.debug("route middleware to authenticate and check token: " + req.session.authToken);
	if (req.session.authToken) {
		// var cookie = JSON.parse(req.cookies.userCookie);
		// var token = cookie.token;
		var authToken = JSON.parse(req.session.authToken);
		var token = authToken.token;
		logger.debug("token: " + token);
		if(!token) {
			Utils.sendJSONres(res, 404, "Token not found");
			return;
		}
		
		jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
			if(err) {
				logger.error("jwt.verify error");
				Utils.sendJSONres(res, 404, null);
				return;
			} 

			if(decoded) {
			    console.log("decoded valid");
			    if(Utils.isJwtValidDate(decoded)) {
						logger.debug("systemDate valid");
						next();
					} else {
						logger.error('No data valid');
						Utils.sendJSONres(res, 404, "Data is not valid");
					}
			}
		});
		
	} else {
		logger.error('No token');
		Utils.sendJSONres(res, 403, 'No token provided.');
	}
};