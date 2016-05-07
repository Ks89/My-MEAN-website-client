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

    vm.activationStatus = '';
    vm.emailToken = $routeParams.emailToken;

    authentication.activateAccount($routeParams.emailToken)
    .then(function(result){
      // $location.search('page', null); 
      // $location.path(vm.returnPage);
      console.log("authentication.activateAccount result :");
      console.log(result);
      vm.activationStatus = 'ACTIVATED!!!!';
      $location.url('/login');
      // $location.search('page', null); 
      // $location.path(vm.returnPage);
    }, function(err) {
      console.log("Error authentication.resetPassword");
      vm.activationStatus = 'ERROR';
    });
   

  }
})();