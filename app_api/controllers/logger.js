var logger = require('../utils/logger.js');
var Utils = require('../utils/util.js');

/* POST to log a debug message */
/* /api/logDebug */
module.exports.logDebug = (req, res) => {
	console.log('Called logDebug = ');
	console.log(req.body);
	logger.debug('Called logDebug: ' + JSON.stringify(req.body.message));
	if(req.body) {
		Utils.sendJSONresponse(res, 200, "Debug logged on server: " + req.body);
	} else {
		Utils.sendJSONresponse(res, 404, "Impossible to log debug on server, body is empty");
	}
};

/* POST to log an error message */
/* /api/logError */
module.exports.logError = (req, res) => {
	console.error("Called logError = ");
	console.error(req.body);
	logger.error('Called logError: ' + JSON.stringify(req.body));
	if(req.body) {
		Utils.sendJSONresponse(res, 200, "Error logged on server: " + req.body);
	} else {
		Utils.sendJSONresponse(res, 404, "Impossible to log error on server, body is empty");
	}
};