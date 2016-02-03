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

    var cookie = $cookies.get('connect.sid');

    var jsonCookie = JSON.parse($cookies.get('usertoken'));

    console.log("COOKIES:-> ");
    console.log(cookie);

    console.log('User token is: ' + jsonCookie.value);

    if(jsonCookie) {
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
        token : ''
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

    vm.connect = function (serviceName) {
      console.log("connect called");
      authentication.connect(serviceName)
      .then(function(){
        console.log("connect then " + serviceName);
      });
      console.log("connect completed");
    };

    //TODO change this with a real implementation
    vm.usertoken = true;

    vm.unlink = function (serviceName) {
      console.log("unlink called");
      authentication.unlink(serviceName)
      .then(function(){
        console.log("unlink then " + serviceName);
      });
      console.log("unlink completed");
    };
  }
})();