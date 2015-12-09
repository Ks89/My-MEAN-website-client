(function () {
  angular
  .module('mySiteApp')
  .controller('profileCtrl', profileCtrl);


  profileCtrl.$inject = ['authentication'];
  function profileCtrl(authentication) {
    var vm = this;
    vm.pageHeader = {
      title: 'Profile',
      strapline: ' Welcome'
    };
    vm.sidebar = {
      content: "Profile page"
    };
    vm.message = "Profile page";

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