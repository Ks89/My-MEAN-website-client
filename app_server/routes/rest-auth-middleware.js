// ------------- imported from ./index.js ---------------

var jwt = require('jsonwebtoken');
var logger = require('../utils/logger');
var Utils = require('../utils/util');

module.exports.restAuthenticationMiddleware = function(req, res, next) {
	logger.error("restAuthenticationMiddleware - req.session.authToken:" + req.session.authToken);
	try {
		if (req.session.authToken) {
			// var cookie = JSON.parse(req.cookies.userCookie);
			// var token = cookie.token;
			var authToken = JSON.parse(req.session.authToken);
			var token = authToken.token;
			logger.debug("restAuthenticationMiddleware - parsed token:" + token);
			if(!token) {
				logger.error("restAuthenticationMiddleware - Token not found");
				Utils.sendJSONres(res, 404, "Token not found");
				return;
			}

			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				if(err) {
					logger.error("restAuthenticationMiddleware - jwt.verify error");
					Utils.sendJSONres(res, 401, "Jwt not valid or corrupted");
					return;
				}

				if(decoded) {
					console.log("restAuthenticationMiddleware - decoded is valid");
					try {
						if(Utils.isJwtValidDate(decoded)) {
							logger.debug("systemDate valid");
							next();
						} else {
							logger.error('restAuthenticationMiddleware - jwt has an invalid data');
							Utils.sendJSONres(res, 404, "Data is not valid");
						}
					} catch (e) {
						logger.error('restAuthenticationMiddleware - error during Utils.isJwtValidDate');
						Utils.sendJSONres(res, 500, "Impossible to check if jwt is valid");
					}
				} else {
					logger.error('restAuthenticationMiddleware - decoded is not valid (but before err was ok - WTF!!!)');
					Utils.sendJSONres(res, 500, "Impossible to check if jwt is valid - decoded is not valid");
				}
			});

		} else {
			logger.error('restAuthenticationMiddleware - req.session.authToken not valid');
			Utils.sendJSONres(res, 403, 'No token provided');
		}
	} catch(e) {
		logger.error('restAuthenticationMiddleware - exception catched');
		Utils.sendJSONres(res, 403, 'No token provided');
	}
};
