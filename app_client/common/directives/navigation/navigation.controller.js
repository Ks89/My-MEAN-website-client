(function () {

  angular
  .module('mySiteApp')
  .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location', 'authentication'];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.currentPath = $location.path();

    //used to show or hide links and buttons into the navigation bar
    vm.isLoggedIn = authentication.isLoggedIn();

    //---------------------------local--------------------------
    authentication.getLocalUser()
    .then(function(data) {
      console.log("Navigation conttroller localuser:");
      console.log(data);
      vm.currentUser = data;
    });

    //--------------------------3dauth--------------------------
    authentication.get3dAuthUser()
    .then(function(data) {
      console.log("Navigation conttroller 3dauthuser:");
      vm.currentUser = data;
    });

    vm.logout = function() {
      authentication.logout();
      $location.path('/');
    };
  }
})();