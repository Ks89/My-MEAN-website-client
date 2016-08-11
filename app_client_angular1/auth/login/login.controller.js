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

    vm.isWaiting = false;

    vm.facebookOauthUrl = 'api/auth/facebook';
    vm.googleOauthUrl = 'api/auth/google';
    vm.githubOauthUrl = 'api/auth/github';
    vm.linkedinOauthUrl = 'api/auth/linkedin';
    vm.twitterOauthUrl = 'api/auth/twitter';

    //vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.isWaiting = true;
      vm.formError = "";
      if (!vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        vm.isWaiting = false;
        return false;
      } else {
        doLogin();
      }
    };

    function doLogin() {
      vm.formError = "";
      authentication.login(vm.credentials)
      .then(function(data){
        //redirect to profile page
        vm.isWaiting = false;
        $location.url('/profile');
      }, function(err) {
        vm.isWaiting = false;
        console.log("LOGIN FAILED");
        console.log(err);
        if(err && err.message) {
          vm.formError = err.message;
        }
      });
    }
  }
})();