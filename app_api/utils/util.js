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
 },

 getFilteredUser : function(user) {
   var cloned = Object.create(user);
   if(user.local) {
      cloned.local.hash = undefined; //important => remove the hashed password
   } 
   if(user.github) {
      cloned.github.profileUrl = undefined;
      cloned.github.token = undefined;
      cloned.github.username = undefined;
   }
   if(user.facebook) {
      cloned.facebook.profileUrl = undefined;
      cloned.facebook.token = undefined;
   }
   if(user.google) {
      cloned.google.token = undefined;
   }
   //add other services
   return cloned;
 }
};

module.exports = Utils;