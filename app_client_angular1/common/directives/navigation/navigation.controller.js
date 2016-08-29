'user strict';
(function () {

  angular
  .module('mySiteApp')
  .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location', 'authentication'];
  function navigationCtrl($location, authentication) {
    var navvm = this;

    navvm.currentPath = $location.path();

    navvm.currentUser = {
      'name' : ''
    };

    navvm.isActive = function (viewLocation) {
        return viewLocation === navvm.currentPath;
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
          } else if(user.linkedin) {
            setCurrentUser(user.linkedin);
          }
        }

        authentication.isLoggedIn()
        .then(function(result) {
          console.log('Nav isLoggedIn local  Success: ' + result);
          navvm.isLoggedIn =  result;
        },function(reason) {
          console.log('Nav isLoggedIn local  Failed: ' + reason);
          navvm.isLoggedIn =  false;
        });
      } else {
        console.log("navigation called getLoggedUser but data was null");
      }
    }, function(error){
      console.log(error);
      authentication.isLoggedIn()
      .then(function(result) {
        console.log('Nav isLoggedIn local  Success: ' + result);
        navvm.isLoggedIn =  result;
      },function(reason) {
        console.log('Nav isLoggedIn local  Failed: ' + reason);
        navvm.isLoggedIn =  false;
      });
    });

    function setCurrentUser(originData) {
      if(originData) {
        navvm.currentUser = {
          name : originData.name
        };
      }
    }

    navvm.logout = function() {
      authentication.logout()
      .then(function(result) {
        console.log('Logged out: ' + result);
        navvm.isLoggedIn =  false;
      },function(reason) {
        console.log('Impossibile to logout: ' + reason);
        navvm.isLoggedIn =  false; //FIXME, Choose the value, I don't know, but I suppose "false"
      });
      $location.path('/');
    };
  }
})();
