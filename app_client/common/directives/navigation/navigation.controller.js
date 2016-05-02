'user strict';
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

    vm.currentUser = {
      'name' : '' 
    };

    authentication.getLoggedUser()
    .then(function(data) {
      console.log("##########################navigation called getLoggedUser");
      if(data) {
        console.log(data);
        console.log("navigation called data valid");
        var user = JSON.parse(data);
        console.log("navigation called getLoggedUser user parsed");
        console.log(user);
        if(user) {
          console.log("setting currentUser navigation.........................");
          if(user.local) {
            setCurrentUser(user.local);
          } else if(user.github) {
            setCurrentUser(user.github);
          } else if(user.facebook) {
            setCurrentUser(user.facebook);
          } else if(user.google) {
            setCurrentUser(user.google);
          } else if(user.twitter) {
            setCurrentUser(user.twitter);
          }
        }

        authentication.isLoggedIn()
        .then(function(result) {
          console.log('Nav isLoggedIn local  Success: ' + result);
          vm.isLoggedIn =  result;
        },function(reason) {
          console.log('Nav isLoggedIn local  Failed: ' + reason);
          vm.isLoggedIn =  false;
        });
      } else {
        console.log("navigation called getLoggedUser but data was null");
      }
    }, function(error){
      console.log(error);
    });

    function setCurrentUser(originData) {
      if(originData) {
        vm.currentUser = {
          name : originData.name
        };
      }
    }

    vm.logout = function() {
      authentication.logout()
      .then(function(result) {
        console.log('Logged out: ' + result);
        vm.isLoggedIn =  false;
      },function(reason) {
        console.log('Impossibile to logout: ' + reason);
        vm.isLoggedIn =  false; //FIXME, Choose the value, I don't know, but I suppose "false"
      });
      $location.path('/');
    };
  }
})();