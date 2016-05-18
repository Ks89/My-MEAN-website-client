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

    vm.status = 'success';
    vm.message = '';

    vm.onSubmit = function() {
      authentication.resetPassword($routeParams.emailToken, vm.newPassword)
      .then(function(result){
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
        console.log("authentication.resetPassword result :");
        console.log(result);
        vm.status = 'success';
        vm.message = 'Account updated! Please, go back to the login page to continue.';
        //$location.url('/login');
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
      }, function(err) {
        vm.status = 'danger';
        console.log("Error authentication.resetPassword");
        if(err && err.message) {
          vm.message = err.message;
        }
      });
   };

  }
})();