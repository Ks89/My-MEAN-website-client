(function () {

  angular
  .module('mySiteApp')
  .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location', 'authentication'];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.currentPath = $location.path();

    //used to show or hide links and buttons into the navigation bar
    
    authentication.isLoggedIn()
    .then(function(result) {
      console.log('Nav isLoggedIn local  Success: ' + result);
      vm.isLoggedIn =  result;
    },function(reason) {
      console.log('Nav isLoggedIn local  Failed: ' + reason);
      vm.isLoggedIn =  false;
    });

    //---------------------------local--------------------------
    authentication.getLocalUser()
    .then(function(data) {
      console.log("navigation -> authentication.getLocalUser()");

      if(data && data.user && data.user.local) {
        var user = data.user;
        console.log("setting vm.local in Navigation.controller");
        console.log(user);
        vm.currentUser = user.local;
      } else {
        console.log("Navigation called authentication.getLocalUser() but data was null");
      }
    });

    //--------------------------3dauth--------------------------
    authentication.get3dAuthUser()
    .then(function(data) {
      console.log("Navigation conttroller 3dauthuser:");
      if(data && data.user) {
        var user = data.user;
        vm.currentUser = user;
      }
    }, function(reason) {
      console.log("navigation - get3dAuthUser failed: " + reason);
    });

    vm.logout = function() {
      authentication.logout();
      $location.path('/');
    };
  }
})();