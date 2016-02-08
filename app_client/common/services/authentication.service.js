(function () {
  angular
  .module('mySiteApp')
  .service('authentication', authentication);

  authentication.$inject = ['$http', '$window', '$cookies'];
  function authentication ($http, $window, $cookies) {

    //----------------------------
    //--- local authentication ---
    //----------------------------
    var register = function(user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken('local', data.token);
      });
    };

    var login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken('local', data.token);
      });
    };

    //-----------------------------
    //--- 3dauth authentication ---
    //----------------------------
    var getLocalAuthCurrentUser = function() {
      if(isLoggedIn()){
        console.log("User is logged in");
        var token = getToken('local');
        var token3dauth = getToken('3dauth');
        console.log("User is logged in with token3dauth " + token3dauth + " and/or " + token);
        if(token) {
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return {
            email : payload.email,
            name : payload.name
          };
        } 
      }
    };

    var isAuth3dLoggedIn = function() {
      var token3dauth = getToken('3dauth');
      if(token3dauth) {
        return true;
      } else {
       return false;
      }
    };

    //function to call the /users/:id REST API
    var getUserById = function (id) {
      return $http.get('/api/users/' + id);
    };


   //---------------------------------------
   //--- local and 3dauth authentication ---
   //---------------------------------------
    var logout = function() {
      removeToken('local');
      removeToken('3dauth');
      removeCookie('userCookie');
      removeCookie('connect.sid');
    };

    var isLoggedIn = function() {
      //local 
      var token = getToken('local');
      if(token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        //3dauth
        return isAuth3dLoggedIn();
      }
    };

    var getToken = function (key) {
      return $window.localStorage[key];
    };

    var saveToken = function (key, token) {
      $window.localStorage[key] = token;
    };

    //-----------------------------------
    //--- private functions - not exposed
    //-----------------------------------
    function removeToken(key) {
      $window.localStorage.removeItem(key);
    };

    function removeCookie(key) {
      $cookies.remove(key);
    };
    
    return {
      getToken : getToken,
      saveToken : saveToken,
      getLocalAuthCurrentUser : getLocalAuthCurrentUser,
      getUserById : getUserById,
      isLoggedIn : isLoggedIn,
      isAuth3dLoggedIn : isAuth3dLoggedIn,
      register : register,
      login : login,
      logout : logout
    };
  }
})();