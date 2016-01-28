(function () {
  angular
  .module('mySiteApp')
  .service('profile', profile);

  profile.$inject = ['$http', '$window'];
  function profile ($http, $window) {

    var saveToken = function (token) {
      $window.localStorage['mywebsite-token-profile'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mywebsite-token-profile'];
    };

    var getUserByToken = function (token) {
      return $http.get('/api/users/' + token);
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

    removeToken = function() {
      $window.localStorage.removeItem('mywebsite-token');
    };

    return {
      removeToken : removeToken,
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      getUserByToken : getUserByToken
    };
  }
})();