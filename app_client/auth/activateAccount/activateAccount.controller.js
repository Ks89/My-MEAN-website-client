(function () {

  angular
  .module('mySiteApp')
  .controller('activateAccountCtrl', activateAccountCtrl);

  activateAccountCtrl.$inject = ['$location', '$routeParams', 'authentication'];
  function activateAccountCtrl($location, $routeParams, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Account activation'
    };

    vm.emailToken = $routeParams.emailToken;

    vm.status = 'success';
    vm.message = '';

    authentication.activateAccount($routeParams.emailToken)
    .then(function(result){
      // $location.search('page', null); 
      // $location.path(vm.returnPage);
      console.log("authentication.activateAccount result :");
      console.log(result);
      vm.status = 'success';
      vm.message = 'Account activated successfully!';
      //$location.url('/login');
      // $location.search('page', null); 
      // $location.path(vm.returnPage);
    }, function(err) {
      vm.status = 'danger';
      vm.message = err.data;
      console.log("Error authentication.resetPassword");
    });
   

  }
})();