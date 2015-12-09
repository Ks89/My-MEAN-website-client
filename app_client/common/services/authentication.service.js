(function () {
  angular
  .module('mySiteApp')
  .service('authentication', authentication);

  authentication.$inject = ['$http', '$window'];
  function authentication ($http, $window) {

    var saveToken = function (token) {
      $window.localStorage['mywebsite-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mywebsite-token'];
    };

    var isLoggedIn = function() {
      var token = getToken();

      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        var token = getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return {
          email : payload.email,
          name : payload.name
        };
      }
    };

    register = function(user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken(data.token);
      });
    };

    login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken(data.token);
      });
    };

    logout = function() {
      $window.localStorage.removeItem('mywebsite-token');
    };

    thirdPartyLogin = function(serviceName) {
      console.log("thirdPartyLogin called with serviceName: " + serviceName);
      return $http({
        method: 'GET',
        url: '/api/auth/' + serviceName,
      }).then(function successCallback(response) {
        console.log("http success response: ");
        console.log(response);
        //saveToken(data.token);
      }, function errorCallback(response) {
        console.log("http error response: ");
        console.log(response);
      });
    };

    connect = function(serviceName) {
      console.log("connect called with serviceName: " + serviceName);
      return $http({
        method: 'GET',
        url: '/api/connect/' + serviceName
      }).then(function successCallback(response) {
        console.log("connect success response: ");
        console.log(response);
        //saveToken(data.token);
      }, function errorCallback(response) {
        console.log("connect error response: ");
        console.log(response);
      });
    };

    unlink = function(serviceName) {
      console.log("unlink called with serviceName: " + serviceName);
      return $http({
        method: 'GET',
        url: '/api/unlink/' + serviceName
      }).then(function successCallback(response) {
        console.log("unlink success response: ");
        console.log(response);
        //saveToken(data.token);
      }, function errorCallback(response) {
        console.log("unlink error response: ");
        console.log(response);
      });
    };

    return {
      currentUser : currentUser,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      logout : logout,
      thirdPartyLogin : thirdPartyLogin,
      connect : connect,
      unlink : unlink
    };
  }
})();