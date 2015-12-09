(function() {

  angular
    .module('mySiteApp')
    .service('contactData', contactData);

  contactData.$inject = ['$http'];
  function contactData ($http) {
   
    console.log('service contactData called');

    var sendEmail = function (data) {

      $http({
        method: 'POST',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
        },
        data: {
          secret: env.process.RECAPTCHA_SECRET,
          response: data.vcRecaptchaResp
        }
      }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
          console.log("successCallback");
          console.log(response);
      }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log("errorCallback");
          console.log(response);
      });

      return $http.post('/api/email', data);
    };

    return {
      sendEmail : sendEmail,
    };
  }

})();