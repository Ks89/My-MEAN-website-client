(function () {
  angular
  .module('mySiteApp')
  .service('authentication', authentication);

  authentication.$inject = ['$http', '$window', '$cookies'];
  function authentication ($http, $window, $cookies) {

    var saveToken = function (key, token) {
      $window.localStorage[key] = token;
    };

    var getToken = function (key) {
      return $window.localStorage[key];
    };

    var getUserById = function (id) {
      return $http.get('/api/users/' + id);
    };

    var isAuth3dLoggedIn = function() {
      var token3dauth = getToken('3dauth');
      if(token3dauth) {
        return true;
      } else {
       return false;
      }
    };

    var isLoggedIn = function() {
      //local 
      var token = getToken('local');
      var token3dauth = getToken('3dauth');

      if(token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        if(token3dauth) {
          return true;
        } else {
          return false;
        }
      }
    };

    var currentUser = function() {
      if(isLoggedIn()){
        console.log("User is logged in");
        var token = getToken('local');
        var token3dauth = getToken('3dauth');
        console.log("User is logged in with token3dauth " + token3dauth + " and/or " + token);
        if(token) {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          console.log(payload);
          console.log(payload.email);
          console.log(payload.name);
          return {
            email : payload.email,
            name : payload.name
          };
        } 
      }
    };

    var getAuth = function () {
      var token3dauth = getToken('3dauth');
      console.log("token3dauth: ");
      console.log(token3dauth);
      return $http.get('/api/users/' + token3dauth);
    };


    register = function(user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken('local', data.token);
      });
    };

    login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken('local', data.token);
      });
    };

    logout = function() {
      removeToken('local');
      removeToken('3dauth');
      removeCookie('userCookie');
      removeCookie('connect.sid');
    };

    var removeToken = function(key) {
      $window.localStorage.removeItem(key);
    };

    var removeCookie = function(key) {
      $cookies.remove(key);
    };
    
    return {
      getAuth : getAuth,
      currentUser : currentUser,
      saveToken : saveToken,
      getUserById : getUserById,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      isAuth3dLoggedIn : isAuth3dLoggedIn,
      register : register,
      login : login,
      logout : logout
    };
  }
})();