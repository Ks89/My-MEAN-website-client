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

 getTextFormattedDate : function(date) {
   var day = date.getDay();
   var month = date.getMonth();
   var year = date.getFullYear();
   var hour = date.getHours();
   var min = date.getMinutes();
   var sec = date.getSeconds();

   return day + "/" + month 
   + "/" + year + " " + hour + ":" + min + ":" + sec;
 }
};

module.exports = Utils;