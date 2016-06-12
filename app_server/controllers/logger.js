var logger = require('../utils/logger.js');
var Utils = require('../utils/util.js');

/* POST to log a debug message */
/* /api/error */
module.exports.error = (req, res) => {
	log(req, res, "error");
};

/* POST to log a debug message */
/* /api/debug */
module.exports.debug = (req, res) => {
	log(req, res, "debug");
};

/* POST to log an error message */
/* /api/exception */
module.exports.exception = (req, res) => {
	console.error("Called log-exception = ");
	console.error(req.body);

	//--IMPORTANT-- save the data on log file
	logger.error('Called log-exception: ' + JSON.stringify(req.body));

	if(req.body) {
		const response = {
			info: "Exception logged on server",
			body : req.body
		};
		Utils.sendJSONresponse(res, 200, response);
	} else {
		const errResponse = {
			info: "Impossible to log exception on server, body is empty",
			body : null
		};
		Utils.sendJSONresponse(res, 404, errResponse);
	}
};

function log(req, res, type) {
	console.log('Called log-' + type + ' = ');
	console.log(req.body);

	//--IMPORTANT-- save the data on log file
	if(type==='debug') {
		logger.debug('Called log-' + type + ': ' + JSON.stringify(req.body.message));
	} else {
		logger.error('Called log-' + type + ': ' + JSON.stringify(req.body.message));
	}

	if(req.body) {
		const response = {
			info: type + " logged on server",
			body : req.body
		};
		Utils.sendJSONresponse(res, 200, response);
	} else {
		const errResponse = {
			info: "Impossible to log" + type + " on server, body is empty",
			body : null
		};
		Utils.sendJSONresponse(res, 404, errResponse);
	}
}