(function () {
  angular
  .module('mySiteApp')
  .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$routeParams','authentication', '$cookies', '$window'];
  function profileCtrl($routeParams, authentication, $cookies, $window) {
    var vm = this;
    vm.pageHeader = {
      title: 'Profile',
      strapline: ' Welcome'
    };
    vm.sidebar = {
      content: "Profile page"
    };
    vm.message = "Profile page";

    // vm.isAuthenticated = resolvedAuth.isLogged();

    // if(vm.isAuthenticated) {
    //   $window.location.href = '/';
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
    var userCookie = $cookies.get('userCookie');
    
    if(!userCookie) { 
      //this means that userCookie is not available, but this don't imply that 
      //my user (on db) haven't 3dauth service saved
      //I must get the entire user object
      authentication.getLocalUser()
      .then(function(data) {
        console.log("Profile called getLocalUser");
        console.log(data);
        if(data && data.user && data.user.user) {
          console.log("getLocalUser data ok");
          var user = data.user.user;
          if(user) {
            console.log("user found");
            setObjectValuesGithub(user.github, vm.github);
            setObjectValues(user.facebook, vm.facebook);
            setObjectValues(user.google, vm.google);
            setObjectValues(user.twitter, vm.twitter);
            setObjectValues(user.linkedin, vm.linkedin);
          }
        } else {
          console.log("Profile called getLocalUser but data was null");
        }
      }, function(reason) {
        console.log('Session expired: ' + reason);
      });
    } else {
      var jsonCookie = JSON.parse(userCookie);
      var auth3dtoken = jsonCookie.token;

      console.log('User cookie has token: ' + auth3dtoken);

      //necessary for the navigation bar
      authentication.saveToken('3dauth', JSON.stringify(auth3dtoken));

      // authentication.getUserById(payload._id)
      // .success(function(data) {
      authentication.decodeJwtToken(auth3dtoken)
      .success(function(data) {
        console.log("Profile called decodeJwtToken");
        if(data) {
          var user = JSON.parse(data);
          console.log(user);
          if(user) {
            setObjectValuesGithub(user.user.github, vm.github);
            setObjectValues(user.user.facebook, vm.facebook);
            setObjectValues(user.user.google, vm.google);
            setObjectValues(user.user.twitter, vm.twitter);
            setObjectValues(user.user.linkedin, vm.linkedin);
          }
        } else {
          console.log("Profile called decodeJwtToken but data was null");
        }
      })
      .error(function (e) {
        console.log(e);
      });
    };

    function buildJsonUserData() {
      return {
        id : '',
        email : '',
        name : '',
        token : '',
      };
    };
    function setObjectValues(originData, destData) {
      if(originData) {
        destData.id = originData.id;
        destData.email = originData.email;
        destData.name = originData.name;
        destData.token = originData.token;
      }
    };
    function setObjectValuesGithub(originData, destData) {
      if(originData) {
        destData.id = originData.id;
        destData.email = originData.email;
        destData.name = originData.displayName;
        destData.token = originData.token;
      }
    };

    //----------------------------------------------------------
    //------------------------local auth------------------------
    //----------------------------------------------------------
    //init
    vm.local = {
      name: '',
      email: ''
    };
    //unlink REST path
    vm.localUnlinkOauthUrl = 'api/unlink/local';
    //get local user
    authentication.getLocalUser()
    .then(function(data) {
      console.log("-------------");
      console.log(data);
      if(data && data.user && data.user.local) {
        var user = data.user;
        console.log("setting vm.local in profile.controller");
        console.log(user);
        vm.local = {
          name: user.local.name,
          email: user.local.email
        };
      } else {
        console.log("Profile called authentication.getLocalUser() but data was null");
      }
    }, function(reason) {
        console.log('Session expired: ' + reason);
    });

    vm.unlinkLocal = function() {
      authentication.unlinkLocal()
      .then(function(data) {
        console.log('unlinklocal finished ');
        vm.local = {
          name: '',
          email: ''
        };
      }, function(reason) {
        console.log('unlinkLocal failed: ' + reason);
      });
    }
  }
})();