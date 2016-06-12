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
	logger.error('Called log-exception: ' + JSON.stringify(req.body));

	if(req.body) {
		Utils.sendJSONresponse(res, 200, "Exception logged on server: " + JSON.stringify(req.body));
	} else {
		Utils.sendJSONresponse(res, 404, "Impossible to log exception on server, body is empty");
	}
};

function log(req, res, type) {
	console.log('Called log-' + type + ' = ');
	console.log(req.body);
	logger.error('Called log-' + type + ': ' + JSON.stringify(req.body.message));

	var response = {
		message: type + " logged on server",
		body : req.body
	};

	if(req.body) {
		Utils.sendJSONresponse(res, 200, response);
	} else {
		Utils.sendJSONresponse(res, 404, "Impossible to log" + type + " on server, body is empty");
	}
}