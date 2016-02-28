(function () {

  angular
    .module('mySiteApp')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location','authentication'];
  function registerCtrl($location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Create a new account'
    };

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    // vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doRegister();
      }
    };

    vm.doRegister = function() {
      vm.formError = "";
      authentication.register(vm.credentials)
      .then(function(){
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
        //redirect to profile page
        $location.url('/profile');
      }, function(err) {
        vm.formError = err.data;
      });
    };
  }

})();