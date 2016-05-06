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

    vm.onSubmit = function() {
      authentication.forgotPassword(vm.email)
      .then(function(){
        console.log("forgot called");
      }, function(err) {
         console.log("forgot error");
      });
   };

  }
})();