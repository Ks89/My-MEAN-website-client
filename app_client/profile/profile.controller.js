(function () {
  angular
  .module('mySiteApp')
  .controller('profileCtrl', profileCtrl);


  profileCtrl.$inject = ['$routeParams','authentication', '$cookies'];
  function profileCtrl($routeParams, authentication, $cookies) {
    var vm = this;
    vm.pageHeader = {
      title: 'Profile',
      strapline: ' Welcome'
    };
    vm.sidebar = {
      content: "Profile page"
    };
    vm.message = "Profile page";

    //initialization
    vm.github = buildJsonUserData();
    vm.google = buildJsonUserData();
    vm.facebook = buildJsonUserData();
    vm.twitter = buildJsonUserData();

    //connect REST path
    vm.facebookConnectOauthUrl = 'api/connect/facebook';
    vm.googleConnectOauthUrl = 'api/connect/google';
    vm.githubConnectOauthUrl = 'api/connect/github';
    vm.twitterConnectOauthUrl = 'api/connect/twitter';
    //unlink REST path
    vm.facebookUnlinkOauthUrl = 'api/unlink/facebook';
    vm.googleUnlinkOauthUrl = 'api/unlink/google';
    vm.githubUnlinkOauthUrl = 'api/unlink/github';
    vm.twitterUnlinkOauthUrl = 'api/unlink/twitter';

    //var cookie = $cookies.get('connect.sid');

    var userCookie = $cookies.get('userCookie');

    if(userCookie != null) {
      var jsonCookie = JSON.parse(userCookie);
      console.log('User cookie is: ' + jsonCookie.value);
      
      authentication.saveToken('3dauth', jsonCookie.value);

      authentication.getUserById(jsonCookie.value)
      .success(function(data) {
        setObjectValuesGithub(data.github, vm.github);
        setObjectValues(data.facebook, vm.facebook);
        setObjectValues(data.google, vm.google);
        setObjectValues(data.twitter, vm.twitter);
      })
      .error(function (e) {
        console.log(e);
      });
    };

    vm.local = {
      name: '',
      email: ''
    };

     //set the current user retrieving data from local
    //if(vm.isLoggedIn) {
    var localToken = authentication.getToken('local');
    if(localToken) {
      authentication.getUserById((JSON.parse(localToken)).id)
      .success(function(data) {
        console.log('Profile local user ');
        console.log(data.local);
        vm.local = {
          email : data.local.email,
          name : data.local.name
        };
      })
      .error(function(e) {
                console.log('Profile local user error ');

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
    // TODO remove this and merge with setObjectValues
    function setObjectValuesGithub(originData, destData) {
      if(originData) {
        destData.id = originData.id;
        destData.email = originData.email;
        destData.name = originData.displayName;
        destData.token = originData.token;
      }
    };
  }
})();