(function () {

  angular
    .module('mySiteApp')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location', 'authentication'];
  function navigationCtrl($location, authentication) {
    var vm = this;

    vm.currentPath = $location.path();

    vm.isLoggedIn = authentication.isLoggedIn();

    //set the current user retrieving data from local
    var localToken = authentication.getToken('local');
    if(vm.isLoggedIn && localToken) {
      authentication.getUserById((JSON.parse(localToken)).id)
      .success(function(data) {
        console.log('Local user ');
        console.log(data);
        vm.currentUser = {
          email : data.local.email,
          name : data.local.name
        };
      })
      .error(function(e) {
        console.log(e);
      });
    };

    //set the current user retrieving data from 3auth
    if(authentication.isAuth3dLoggedIn()) {
      authentication.getUserById(authentication.getToken('3dauth'))
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