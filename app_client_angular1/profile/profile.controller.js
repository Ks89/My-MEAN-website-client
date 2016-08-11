(function () {
  angular
  .module('mySiteApp')
  .controller('profileCtrl', profileCtrl);

  profileCtrl.$inject = ['$location','authentication', 'profileData', 'logServer', '$window', '$log', '$uibModal'];
  function profileCtrl($location, authentication, profileData, logServer, $window, $log, $uibModal) {
    var vm = this;
    vm.pageHeader = {
      title: 'Profile',
      strapline: ' Welcome'
    };
    vm.sidebar = {
      title: 'Other services',
      strapline: ' '
    };

    vm.credentials = {
      localUserEmail: "",
      id: "",
      serviceName: "",
      name : "",
      surname: "",
      nickname: "",
      email : ""
    };

    vm.isWaiting = false;
    vm.formStatus = 'danger';
    vm.formDisable = false;

    vm.currentPath = $location.path();

    vm.bigProfileImage = '../images/profile/bigProfile.png';

    //----------------------------------------------------------
    //--------------------------local---------------------------
    //----------------------------------------------------------
    vm.local = {
      name: '',
      email: ''
    };

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

    //3dparty authentication
    authentication.getLoggedUser()
    .then(function(data) {
      $log.info("Profile called getLoggedUser");
      if(data) {
        console.log(data);
        console.log("Profile called data valid");
        var user = JSON.parse(data);
        console.log("Profile called getLoggedUser user parsed");
        console.log(user);
        if(user) {
          console.log("setting data.........................");
          setObjectValuesLocal(user.local, vm.local);
          setObjectValues(user.github, vm.github);
          setObjectValues(user.facebook, vm.facebook);
          setObjectValues(user.google, vm.google);
          setObjectValues(user.twitter, vm.twitter);
          setObjectValues(user.linkedin, vm.linkedin);
          if(user.profile) {
            vm.credentials = user.profile;
          }
          console.log("---------------setted----------------");
        }
      } else {
        logServer.error("Profile called getLoggedUser but data was null");
        console.log("Profile called getLoggedUser but data was null");
      }
    }, function(error){
      logServer.error("profile getLoggedUser",error);
      console.log(error);
    });

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
        destData.name = originData.name ? originData.name : originData.username;
        destData.token = originData.token;
      }
    }
    function setObjectValuesLocal(originData, destData) {
      if(originData) {
        destData.email = originData.email;
        destData.name = originData.name;
      }
    }
  
    vm.onSubmit = function () {
      vm.isWaiting = true;
      vm.formMessage = "";
      // if (!vm.credentials.email || !vm.credentials.nickname) {
      //   vm.formMessage = "Email and nickname are required";
      //   vm.isWaiting = false;
      // } else {
        updateProfile();
      //}
    };

    function updateProfile() {
      vm.formDisable = true;
      vm.formDisable = true;
      console.log("vm.credentials:");
      console.log(vm.credentials);

      if(vm.local.email) {
        vm.credentials.localUserEmail = vm.local.email;
        vm.credentials.serviceName = 'local';
      } else if(vm.facebook.id) {
        vm.credentials.id = vm.facebook.id;
        vm.credentials.serviceName = 'facebook';
      } else if(vm.google.id) {
        vm.credentials.id = vm.google.id;
        vm.credentials.serviceName = 'google';
      } else if(vm.github.id) {
        vm.credentials.id = vm.github.id;
        vm.credentials.serviceName = 'github';
      } else if(vm.linkedin.id) {
        vm.credentials.id = vm.linkedin.id;
        vm.credentials.serviceName = 'linkedin';
      } else if(vm.twitter.id) {
        vm.credentials.id = vm.twitter.id;
        vm.credentials.serviceName = 'twitter';
      }

      profileData.update(vm.credentials)
      .then(function(data){
        vm.isWaiting = false;
        vm.formMessage = data.message;
        vm.formStatus = 'success';
        vm.formDisable = false;
      }, function(err) {
        logServer.error("profile update", err);
        vm.isWaiting = false;
        vm.formMessage = err;
        vm.formStatus = 'danger';
        vm.formDisable = false;
      });
    }

    //----------------------------------------------------------
    //------------------------- COMMON -------------------------
    //----------------------------------------------------------
    vm.unlink = function(serviceName) {
      console.log("unlink " + serviceName + " called");
      logServer.debug("unlink " + serviceName + " called");

      if(checkIfLastUnlinkProfile(serviceName)) {
        console.log('Last unlink - processing...');

        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl as vm',
          size: 'lg'
        });
        
        modalInstance.result.then(function (data) {
          console.log("Modal clicked on OK button");
          //TODO If you remove also this account, 
          //you'll lose all your accounts and data!
          authentication.unlink(serviceName)
          .then(function(result) {
            console.log('Unlinked: ' + result);
            authentication.logout()
            .then(function(result) {
              console.log('Logged out: ' + result);
              $location.path('/home');
            },function(reason) {
              logServer.error("profile impossible to logout", reason);
              console.log('Impossible to logout: ' + reason);
              $location.path('/home');
            });
          },function(reason) {
            logServer.error("profile error unlink", reason);
            console.log('Impossible to unlink: ' + reason);
          });
        }, function (data) {
          $log.info('Modal dismissed');
        });
      } else {
        console.log('NOT last unlink - checking...');
        if(serviceName==='facebook' || serviceName==='google' || 
          serviceName==='github' || serviceName==='local' || 
          serviceName==='linkedin' || serviceName==='twitter') {
            console.log('NOT last unlink - but service recognized, processing...');
            authentication.unlink(serviceName)
            .then(function(result) {
              console.log(serviceName + ' Unlinked with result user: ');
              console.log(result.data);
              $window.location.href = '/profile';
              console.log("redirected to profile");
            },function(reason) {
              logServer.error("profile impossible to unlink", reason);
              console.log('Impossible to unlink: ' + reason);
              $location.path('/home');
            });
        } else {
          logServer.error("Unknown service. Aborting operation!");
          console.error("Unknown service. Aborting operation!");
        }
      }
    };

    function checkIfLastUnlinkProfile(serviceName) {
      switch(serviceName) {
        case 'github':
          return vm.facebook.name==='' && vm.google.name==='' && vm.local.name==='' && vm.linkedin.name==='' && vm.twitter.name==='';
        case 'google':
          return vm.github.name==='' && vm.facebook.name==='' && vm.local.name==='' && vm.linkedin.name==='' && vm.twitter.name==='';
        case 'facebook':
          return vm.github.name==='' && vm.google.name==='' && vm.local.name==='' && vm.linkedin.name==='' && vm.twitter.name==='';
        case 'local':
          return vm.github.name==='' && vm.facebook.name==='' && vm.google.name==='' && vm.linkedin.name==='' && vm.twitter.name==='';
        case 'linkedin':
          return vm.facebook.name==='' && vm.google.name==='' && vm.local.name==='' && vm.github.name==='' && vm.twitter.name==='';
        case 'twitter':
          return vm.facebook.name==='' && vm.google.name==='' && vm.local.name==='' && vm.github.name==='' && vm.linkedin.name==='';
        default:
          logServer.error("Service name not recognized in profile checkIfLastUnlink");
          console.log('Service name not recognized in profile checkIfLastUnlink');
          return false;
      }
    }
  }
})();

// -------------------- Modal dialog ----------------------
(function () {
  angular
  .module('mySiteApp')
  .controller('ModalInstanceCtrl', ModalInstanceCtrl);

  ModalInstanceCtrl.$inject = ['$uibModalInstance'];
  function ModalInstanceCtrl($uibModalInstance) {
    var vm = this;
    vm.modalDialogOk = function () {
      $uibModalInstance.close('ok');
    };
    vm.modalDialogCancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }
})();