(function () {

  angular
    .module('mySiteApp')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location','authentication'];
  function loginCtrl($location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Sign in'
    };

    vm.credentials = {
      email : "",
      password : ""
    };

    //using the working solution
    vm.facebookOauthUrl = 'api/auth/facebook';
    vm.googleOauthUrl = 'api/auth/google';
    vm.githubOauthUrl = 'api/auth/github';

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doLogin();
      }
    };

    vm.doLogin = function() {
      vm.formError = "";
      authentication
        .login(vm.credentials)
        .error(function(err){
          vm.formError = err;
        })
        .then(function(){
          $location.search('page', null); 
          $location.path(vm.returnPage);
        });
    };

    vm.on3dPartyLogin = function (serviceName) {
      console.log("on3dPartyLogin called");
      authentication.thirdPartyLogin(serviceName)
      .then(function(){
          console.log("then " + serviceName);
          $location.search('page', null); 
          $location.path(vm.returnPage);
      });
      console.log("on3dPartyLogin completed");
    };
  }

})();