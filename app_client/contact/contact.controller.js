(function () {

	angular
	.module('mySiteApp')
	.controller('contactCtrl', contactCtrl);

	contactCtrl.$inject = ['$scope', 'contactData', 'vcRecaptchaService'];
	function contactCtrl ($scope, contactData, vcRecaptchaService) {
		var vm = this;
		vm.pageHeader = {
			title: 'Contact',
			strapline: 'Send me an email'
		};		
		vm.message = "Contact page";

		vm.publicKey = "6Lf0jxQTAAAAAIDxhvAqGseKy_KV2_4iViVeQWYi"; //not secret, no problem ;)

		vm.onSubmit = function () {
			vm.formResultMessage = "";
			
			console.log("recaptcha: " + vcRecaptchaService.getResponse());

			if(vcRecaptchaService.getResponse() === ""){ 
                alert("Please resolve the captcha and submit!")
            } else {
				if (!vm.formData.email || !vm.formData.object || !vm.formData.messageText) {
					vm.formResultMessage = "All fields required, please try again";
					vm.error = "warning";
					return true;
				} else {
					vm.sendEmail(vm.formData, vcRecaptchaService.getResponse());
				}
			}
		};

		vm.sendEmail = function (formData, vcRecaptchaResp) {
			contactData.sendEmail({
				email: formData.email,
				object : formData.object,
				messageText : formData.messageText,
				vcRecaptchaResp: vcRecaptchaResp
			})
			.success(function (data) {
				vm.formResultMessage = "Success! Email sent, thank you.";
				vm.error = "success";
			})
			.error(function (data) {
				vm.formResultMessage = "Your email has not been sent!";
				vm.error = "danger";
			});
		};
		return
	}
})();