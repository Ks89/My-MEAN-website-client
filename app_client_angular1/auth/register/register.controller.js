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

    vm.isWaiting = false;

    // vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.isWaiting = true;
      vm.formError = "";
      if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        vm.isWaiting = false;
      } else {
        doRegister();
      }
    };

    function doRegister() {
      vm.formError = "";
      authentication.register(vm.credentials)
      .then(function(){
        // $location.search('page', null); 
        // $location.path(vm.returnPage);
        //redirect to profile page
        $location.url('/login');
        vm.isWaiting = false;
      }, function(err) {
        vm.isWaiting = false;
        if(err && err.message) {
          vm.formError = err.message;
        }
      });
    }
  }

})();