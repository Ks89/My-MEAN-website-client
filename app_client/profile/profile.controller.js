(function () {
  angular
  .module('mySiteApp')
  .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location', '$routeParams','authentication', '$window'];
  function profileCtrl($location, $routeParams, authentication, $window) {
    var vm = this;
    vm.pageHeader = {
      title: 'Profile',
      strapline: ' Welcome'
    };
    vm.sidebar = {
      content: "Profile page"
    };
    vm.message = "Profile page";

    vm.local = {
      name: '',
      email: ''
    };

    vm.currentPath = $location.path();

    // if(!$window.sessionStorage.auth) {
    //   $location.path('/login');
    // }

    //----------------------------------------------------------
    //--------------------------3dauth--------------------------
    //----------------------------------------------------------
    //init
    vm.github = buildJsonUserData();
    vm.google = buildJsonUserData();
    vm.facebook = buildJsonUserData();
    vm.twitter = buildJsonUserData();
    vm.linkedin = buildJsonUserData();
    //connect REST path
    vm.facebookConnectOauthUrl = 'api/connect/facebook';
    vm.googleConnectOauthUrl = 'api/connect/google';
    vm.githubConnectOauthUrl = 'api/connect/github';
    vm.twitterConnectOauthUrl = 'api/connect/twitter';
    vm.linkedinConnectOauthUrl = 'api/connect/linkedin';
    //unlink REST path
    vm.facebookUnlinkOauthUrl = 'api/unlink/facebook';
    vm.googleUnlinkOauthUrl = 'api/unlink/google';
    vm.githubUnlinkOauthUrl = 'api/unlink/github';
    vm.twitterUnlinkOauthUrl = 'api/unlink/twitter';
    vm.linkedinUnlinkOauthUrl = 'api/unlink/linkedin';
    //3dparty authentication

    // var userCookie = $cookies.get('userCookie');
    
    // if(userCookie) {
    //   var jsonCookie = JSON.parse(userCookie);
    //   var auth3dtoken = jsonCookie.token;

    //   console.log('User cookie has token: ' + auth3dtoken);

    //   //necessary for the navigation bar
    //   authentication.saveToken('auth', JSON.stringify(auth3dtoken));
    // }


    // authentication.getTokenRedis('auth')
    // .then(function(tokenData) {
    //   console.log('token obtained from redis');     
    //   console.log("sessionToken");
    //   if(tokenData && tokenData.data) {
    //     console.log(tokenData.data);
    //     var tokenObj = JSON.parse(tokenData.data);
    //     console.log("tokenobj: " + tokenObj);
    //     if(tokenObj) {
    //       var token = tokenObj.token;
    //       console.log("real token is: " + token);
    //       authentication.saveToken('auth', token);

          authentication.getLoggedUserExperimental()
          .then(function(data) {
            console.log("[[[[[[[]]]]]] Profile called getLoggedUser");
            if(data) {
              console.log(data);
              console.log("[[[[[[[]]]]]] Profile called data valid");
              var user = JSON.parse(data);
              console.log("[[[[[[[]]]]]] Profile called getLoggedUser user parsed");
              console.log(user);
              if(user) {
                console.log("[[[[[[[]]]]]] setting data.........................");
                setObjectValuesLocal(user.local, vm.local);
                setObjectValues(user.github, vm.github);
                setObjectValues(user.facebook, vm.facebook);
                setObjectValues(user.google, vm.google);
                setObjectValues(user.twitter, vm.twitter);
                setObjectValues(user.linkedin, vm.linkedin);
                console.log("[[[[[[[]]]]]] ---------------setted----------------");
              }
            } else {
              console.log("[[[[[[[]]]]]] Profile called getLoggedUser but data was null");
            }
          }, function(error){
              console.log("{{{{{{{{{{{{{{{{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}");
              console.log(error);
          });
    //     }
    //   }
    // }, function(error) {
    //   console.log(error);
    // });

    function buildJsonUserData() {
      return {
        id : '',
        email : '',
        name : '',
        token : '',
      };
    }
    function setObjectValues(originData, destData) {
      if(originData) {
        destData.id = originData.id;
        destData.email = originData.email;
        destData.name = originData.name;
        destData.token = originData.token;
      }
    }
    function setObjectValuesLocal(originData, destData) {
      if(originData) {
        destData.email = originData.email;
        destData.name = originData.name;
      }
    }

    //----------------------------------------------------------
    //------------------------local auth------------------------
    //----------------------------------------------------------
    vm.unlinkLocal = function() {
      authentication.unlinkLocal()
      .then(function(data) {
        console.log('unlinklocal finished ');
        vm.local = {
          name: '',
          email: ''
        };
        //redirect to profile page
        $location.url('/profile');
      }, function(reason) {
        console.log('unlinkLocal failed: ' + reason);
      });
    };
  }
})();