(function () {

  angular
  .module('mySiteApp')
  .controller('resetPasswordCtrl', resetPasswordCtrl);

  resetPasswordCtrl.$inject = ['$location', '$routeParams', 'authentication'];
  function resetPasswordCtrl($location, $routeParams, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Password reset'
    };

    vm.resetPasswordResultMessage = '';
    vm.emailToken = $routeParams.emailToken;
    vm.newPassword = '';

    vm.onSubmit = function() {

      authentication.resetPassword($routeParams.emailToken, vm.newPassword)
      .then(function(result){
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
        console.log("authentication.resetPassword result :");
        console.log(result);
        vm.resetPasswordResultMessage = '';
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
      }, function(err) {
        console.log("Error authentication.resetPassword");
      });
   };

  }
})();