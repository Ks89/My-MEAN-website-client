(function () {

  angular
    .module('mySiteApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location', 'authentication'];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.currentPath = $location.path();

    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentUser = authentication.currentUser();

    if(authentication.isAuth3dLoggedIn()) {
      authentication.getAuth()
      .success(function(data) {
        if(data.github) {
          vm.currentUser = {
            email : data.github.email,
            name : data.github.displayName
          }; 
        }
        if(data.google) {
          vm.currentUser = {
            email : data.google.email,
            name : data.google.name
          }; 
        }
        if(data.facebook) {
          vm.currentUser = {
            email : data.facebook.email,
            name : data.facebook.name
          }; 
        }
        if(data.twitter) {
          vm.currentUser = {
            email : data.twitter.email,
            name : data.twitter.name
          }; 
        }
      })
      .error(function (e) {
        console.log(e);
      });
    };

    vm.logout = function() {
      authentication.logout();
      $location.path('/');
    };

  }
})();