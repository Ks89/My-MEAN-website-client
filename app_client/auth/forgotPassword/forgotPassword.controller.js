(function () {

  angular
  .module('mySiteApp')
  .controller('forgotPasswordCtrl', forgotPasswordCtrl);

  forgotPasswordCtrl.$inject = ['$location', 'authentication'];
  function forgotPasswordCtrl($location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Forgot password?'
    };

    vm.email = '';
    vm.status = 'success';
    vm.message = '';
    vm.btnStyleEnable = '';
    vm.formDisable = false;

    vm.onSubmit = function() {
      authentication.forgotPassword(vm.email)
      .then(function(){
        console.log("forgot called");
        vm.status = 'success';
        vm.message = 'An email with a link to reset password has been sent to your mailbox!';
        vm.btnStyleEnable = 'disabled';
        vm.formDisable = true;
        //$location.url('/login');
      }, function(err) {
         vm.status = 'danger';
         console.log("forgot error");
         if(err && err.message) {
            vm.message = err.message;
         }
      });
   };

  }
})();