var logger = require('../utils/logger.js');
var Utils = require('../utils/util.js');

/* POST to log a debug message */
/* /api/logDebug */
module.exports.logDebug = (req, res) => {
  console.log('called logDebug ' + req.body);
  if(req.body) {
    Utils.sendJSONresponse(res, 200, "Debug logged on server: " + req.body);
  }
};

/* POST to log an error message */
/* /api/logError */
module.exports.logError = (req, res) => {
  console.log('called logError ' + req.params.message);
  //if(req.body) {
    Utils.sendJSONresponse(res, 200, "Error logged on server: " + req.params.message);
  //}
};