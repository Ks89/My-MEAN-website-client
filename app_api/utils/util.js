class Utils {

  constructor(){}

  static sendJSONresponse(res, status, content) {
		res.status(status);
		res.contentType('application/json');
		res.json(content);
  }

  static getTextFormattedDate(date) {
    var day = date.getDay();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    return day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;
  }

  static isJwtValidDate(decodedJwtToken) {
    let convertedDate = new Date();
    convertedDate.setTime(decodedJwtToken.exp);

    console.log("date jwt: " + convertedDate.getTime() +
       ", formatted: " + this.getTextFormattedDate(convertedDate));

    const systemDate = new Date();
    console.log("systemDate: " + systemDate.getTime() + 
       ", formatted: " + this.getTextFormattedDate(systemDate));

    return convertedDate.getTime() > systemDate.getTime();
  }

  static getFilteredUser(user) {
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
}

module.exports = Utils;