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

    vm.github = {
      id : '',
      email : '',
      name : '',
      token : ''
    };
    vm.google = {
      id : '',
      email : '',
      name : '',
      token : ''
    };
    vm.facebook = {
      id : '',
      email : '',
      name : '',
      token : ''
    };
    vm.twitter = {
      id : '',
      email : '',
      name : '',
      token : ''
    };

    // vm.token = $routeParams.token;

    var cookie = $cookies.get('connect.sid');
    var cookie2 = $cookies.get('usertoken');

    // cookie2 = cookie2.replace('j:','');
    // cookie2 = cookie2.replace('{','');
    // cookie2 = cookie2.replace('}','');

    var parsed = JSON.parse(cookie2);

    console.log("COOKIES:-> ");
    console.log(cookie);

    console.log(parsed);


    // var jcookie = angular.fromJson(cookie);

    // console.log(jcookie);

    // console.log(jcookie);

    console.log('token is: ' + parsed.value);

    if(parsed) {
      profile.saveToken(parsed.value);

      profile.getUserByToken(parsed.service, parsed.value)
      .success(function(data) {
        console.log(data);
        if(data.github) {
          vm.github.id = data.github.id;
          vm.github.email = data.github.email;
          vm.github.name = data.github.name;
          vm.github.token = data.github.token;
        };
        if(data.facebook) {
          vm.facebook.id = data.facebook.id;
          vm.facebook.email = data.facebook.email;
          vm.facebook.name = data.facebook.name;
          vm.facebook.token = data.facebook.token;
        };
        if(data.google) {
          vm.google.id = data.google.id;
          vm.google.email = data.google.email;
          vm.google.name = data.google.name;
          vm.google.token = data.google.token;
        };
        if(data.twitter) {
          vm.twitter.id = data.twitter.id;
          vm.twitter.email = data.twitter.email;
          vm.twitter.name = data.twitter.name;
          vm.twitter.token = data.twitter.token;
        };
      })
      .error(function (e) {
        console.log(e);
      });
    }

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