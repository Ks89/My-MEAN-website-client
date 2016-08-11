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

    vm.newPassword = '';
    vm.status = 'success';
    vm.message = '';
    vm.btnStyleEnable = '';
    vm.formDisable = false;
    vm.isWaiting = false;


    vm.onSubmit = function() {
      vm.isWaiting = true;
      authentication.resetPassword($routeParams.emailToken, vm.newPassword)
      .then(function(result){
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
        console.log("authentication.resetPassword result :");
        console.log(result);
        vm.status = 'success';
        vm.message = 'Account updated! Please, go back to the login page to continue.';
        vm.btnStyleEnable = 'disabled';
        vm.formDisable = true;
        vm.isWaiting = false;
        //$location.url('/login');
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
      }, function(err) {
        vm.status = 'danger';
        vm.isWaiting = false;
        console.log("Error authentication.resetPassword");
        if(err && err.message) {
          vm.message = err.message;
        }
      });
   };

  }
})();