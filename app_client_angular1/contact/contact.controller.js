(function () {

	angular
	.module('mySiteApp')
	.controller('contactCtrl', contactCtrl);

	contactCtrl.$inject = ['$scope', 'contactData', '$window'];
	function contactCtrl ($scope, contactData, $window) {
		var vm = this;
		vm.pageHeader = {
			title: 'Contact',
			strapline: 'Send me an email'
		};		
		vm.message = "Contact page";

		vm.isWaiting = false;
		vm.formDisable = false;

		vm.publicKey = "6Lf0jxQTAAAAAIDxhvAqGseKy_KV2_4iViVeQWYi"; //not secret, no problem ;)

		vm.onSubmit = function () {
			console.log(vm.formData);
			vm.isWaiting = true;
      vm.formError = "";

      var response = $window.grecaptcha.getResponse("");

      console.log('Response is: ' + response);

      // Build the post data with the emailFormData and the response string
      var data = {
          response: response,
          emailFormData: vm.formData
      };

      //send the form with the captcha
      //if the result is "succes" display a message
      //otherwise print an error
      contactData.sendTheFormWithCaptcha(data)
      .success(function (result) {
        vm.formResultMessage = "Success! Captcha is valid, thank you.";
        vm.error = "success";
        vm.isWaiting = false;
        vm.formDisable = true;
      })
      .error(function (result) {
        vm.formResultMessage = "Invalid Captcha!";
        vm.error = "danger";
        vm.isWaiting = false;
      });
		};
	}
})();