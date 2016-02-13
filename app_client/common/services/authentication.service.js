(function () {
  angular
  .module('mySiteApp')
  .service('authentication', authentication);

  authentication.$inject = ['$q', '$http', '$window', '$cookies'];
  function authentication ($q, $http, $window, $cookies) {

    //----------------------------
    //--- local authentication ---
    //----------------------------
    var register = function(user) {
      return $http.post('/api/register', user).success(function(data){
        saveToken('local', data);
      });
    };

    var login = function(user) {
      return $http.post('/api/login', user).success(function(data) {
        saveToken('local', data);
      });
    };

    var getLocalUser = function() {
      // create a new instance of deferred
      var deferred = $q.defer();

      var localToken = getToken('local');
      if(localToken) {

        getUserById((JSON.parse(localToken)).id)
        .success(function(data) {
          console.log('Profile local user ');
          console.log(data.local);
          var localData = {
            email : data.local.email,
            name : data.local.name
          };
          deferred.resolve(localData);
        })
        .error(function(e) {
          console.log('Profile local user error ');
          console.log(e);
          deferred.reject({});
        });
      }

      // return promise object
      return deferred.promise;
    }

    var getLocalAuthCurrentUser = function() {
      if(isLoggedIn()){
        var token = JSON.parse(getToken('local'));
        console.log("User is logged in with token ");
        console.log(token);
        if(token) {
          return getUserById(token.id);
        };
      } 
    };

    function isAuthLocalLoggedIn(token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    };

    //-----------------------------
    //--- 3dauth authentication ---
    //-----------------------------
    var isAuth3dLoggedIn = function() {
      var token3dauth = getToken('3dauth');
      console.log("User is logged in with token3dauth " + token3dauth);
      if(token3dauth) {
        return true;
      } else {
       return false;
      }
    };

    var get3dAuthUser = function() {
      // create a new instance of deferred
      var deferred = $q.defer();

      if(isAuth3dLoggedIn()) {
        var token = getToken('3dauth');
        var thirdauthData = {};
        getUserById(token)
        .success(function(data) {
          if(data.github) {
            thirdauthData = getThirdAuthData(data.github);
          }
          if(data.google) {
            thirdauthData = getThirdAuthData(data.google); 
          }
          if(data.facebook) {
            thirdauthData = getThirdAuthData(data.facebook);
          }
          if(data.twitter) {
            thirdauthData = getThirdAuthData(data.twitter);
          }
          deferred.resolve(thirdauthData);
        })
        .error(function (e) {
          console.log(e);
          deferred.reject({});
        });
      };

      // return promise object
      return deferred.promise;
    };

    function getThirdAuthData(serviceData) {
      if(serviceData.displayName) {
        return { 
          email : serviceData.email,
          name : serviceData.displayName
        }
      } else {
        return { 
          email : serviceData.email,
          name : serviceData.name
        }
      }
    };

    //---------------------------------------
    //--- local and 3dauth authentication ---
    //---------------------------------------
    //function to call the /users/:id REST API
    var getUserById = function (id) {
      return $http.get('/api/users/' + id);
    };

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
      return isAuthLocalLoggedIn(token);
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
    //--- others functions - not exposed
    //-----------------------------------
    function removeToken(key) {
      $window.localStorage.removeItem(key);
    };
    function removeCookie(key) {
      $cookies.remove(key);
    };
    
    return {
      register : register,
      login : login,
      getLocalUser : getLocalUser,
      getLocalAuthCurrentUser : getLocalAuthCurrentUser,
      isAuth3dLoggedIn : isAuth3dLoggedIn,
      get3dAuthUser : get3dAuthUser,
      getUserById : getUserById,
      logout : logout,
      isLoggedIn : isLoggedIn,
      getToken : getToken,
      saveToken : saveToken
    };
  }
})();