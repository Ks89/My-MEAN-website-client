var jwt = require('jsonwebtoken');

var logger = require('../utils/logger.js');
var Utils = require('../utils/util.js');
var utils = new Utils();

module.exports.restAuthenticationMiddleware = function(req, res, next) {
	logger.debug("route middleware to authenticate and check token: " + req.session.authToken);
	if (req.session.authToken) {
		// var cookie = JSON.parse(req.cookies.userCookie);
		// var token = cookie.token;
		var authToken = JSON.parse(req.session.authToken);
		var token = authToken.token;
		logger.debug("token: " + token);
		if (token) {
			jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
				if(err) {
					logger.error("jwt.verify error");
					utils.sendJSONresponse(res, 404, null);
				} 

				if(decoded) {
					logger.debug("decoded: " + decoded);

					var convertedDate = new Date();
					convertedDate.setTime(decoded.exp);

					logger.silly("date jwt: " + convertedDate.getTime() +
						", formatted: " + utils.getTextFormattedDate(convertedDate));

					var systemDate = new Date();
					logger.silly("systemDate: " + systemDate.getTime() + 
						", formatted: " + utils.getTextFormattedDate(systemDate));

					if( convertedDate.getTime() > systemDate.getTime() ) {
						logger.debug("systemDate valid");
						next();
					} else {
						logger.error('No data valid');
						utils.sendJSONresponse(res, 404, "invalid-data");
					}
				}
			});
		}
	} else {
		logger.error('No token');

		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
	}
};