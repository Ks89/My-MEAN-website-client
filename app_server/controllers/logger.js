var logger = require('../utils/logger.js');
var Utils = require('../utils/util.js');

/**
* @api {post} /api/error Log an error message on server
* @apiVersion 0.0.1
* @apiName PostError
* @apiGroup Logger
* @apiPermission none
*
* @apiDescription Send an error message to the server.
*
* @apiParam {String} message Message to log.
*
* @apiHeaderExample {json} Header-Example:
*     {
*       "Content-Type": "application/json",
*				"Accept": "application/json"
*     }
*
* @apiSuccess {String} info Constant message: "error logged on server".
* @apiSuccess {Object} body Object that contains the response.
* @apiSuccess {String} body.message The same message received as parameter.
*
* @apiSuccessExample {json} Success-Response:
*   HTTP/1.1 200 OK
*   {
*     "info": "error logged on server",
*     "body":
*     {
*       "message": "an error message to log"
*     }
*   }
*/
module.exports.error = (req, res) => {
	log(req, res, "error");
};

/**
* @api {post} /api/debug Log a debug message on server
* @apiVersion 0.0.1
* @apiName PostDebug
* @apiGroup Logger
* @apiPermission none
*
* @apiDescription Send a debug message to the server.
*
* @apiParam {String} message Message to log.
*
* @apiHeaderExample {json} Header-Example:
*     {
*       "Content-Type": "application/json",
*				"Accept": "application/json"
*     }
*
* @apiSuccess {String} info Constant message: "debug logged on server".
* @apiSuccess {Object} body Object that contains the response.
* @apiSuccess {String} body.message The same message received as parameter.
*
* @apiSuccessExample {json} Success-Response:
*   HTTP/1.1 200 OK
*   {
*     "info": "debug logged on server",
*     "body":
*     {
*       "message": "a debug message to log"
*     }
*   }
*/
module.exports.debug = (req, res) => {
	log(req, res, "debug");
};

/**
* @api {post} /api/exception Log an exception message on server
* @apiVersion 0.0.1
* @apiName PostException
* @apiGroup Logger
* @apiPermission none
*
* @apiDescription Send an exception message to the server.
*
* @apiParam {String} message Message to log.
*
* @apiHeaderExample {json} Header-Example:
*     {
*       "Content-Type": "application/json",
*				"Accept": "application/json"
*     }
*
* @apiSuccess {String} info Constant message: "exception logged on server".
* @apiSuccess {Object} body Object that contains the response.
* @apiSuccess {String} body.message The same message received as parameter.
*
* @apiSuccessExample {json} Success-Response:
*   HTTP/1.1 200 OK
*   {
*     "info": "Exception logged on server",
*     "body":
*     {
*       "message": "an exception message to log"
*     }
*   }
*/
module.exports.exception = (req, res) => {
	console.error("Called log-exception = ");
	console.error(req.body);

	//--IMPORTANT-- save the data on log file
	logger.error('Called log-exception: ' + JSON.stringify(req.body));

	const response = {
		info: "Exception logged on server",
		body : req.body
	};
	Utils.sendJSONres(res, 200, response);
};

function log(req, res, type) {
	console.log('Called log-' + type + ' = ');
	console.log(req.body);

	let messageToLog;
	if(req.body && req.body.message) {
		messageToLog = req.body.message;
	} else {
		messageToLog = req.body;
	}

	//--IMPORTANT-- save the data on log file
	if(type === 'debug') {
		logger.debug('Called log-' + type + ': ' + JSON.stringify(messageToLog));
	} else {
		logger.error('Called log-' + type + ': ' + JSON.stringify(messageToLog));
	}

	const response = {
		info: type + " logged on server",
		body : req.body
	};
	Utils.sendJSONres(res, 200, response);
}
