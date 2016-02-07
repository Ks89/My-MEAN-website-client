// Constructor
var Utils = function() {}

// properties and methods
Utils.prototype = {
	// value1: "default_value",
	sendJSONresponse: function(res, status, content) {
		res.status(status);
		res.contentType('application/json');
		res.json(content);
  	},

  	//other methods
};

module.exports = Utils;