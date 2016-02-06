(function () {
  angular
  .module('mySiteApp')
  .controller('profileCtrl', profileCtrl);


  profileCtrl.$inject = ['$routeParams','authentication','profile', '$cookies'];
  function profileCtrl($routeParams, authentication, profile, $cookies) {
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

    var userToken = $cookies.get('usertoken');
    
    if(userToken != null) {
      var jsonCookie = JSON.parse(userToken);
      console.log('User token is: ' + jsonCookie.value);
      
      profile.saveToken(jsonCookie.value);

      profile.getUserByToken(jsonCookie.service, jsonCookie.value)
      .success(function(data) {
        setObjectValues(data.github, vm.github);
        setObjectValues(data.facebook, vm.facebook);
        setObjectValues(data.google, vm.google);
        setObjectValues(data.twitter, vm.twitter);
      })
      .error(function (e) {
        console.log(e);
      });
    }

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
  }
})();