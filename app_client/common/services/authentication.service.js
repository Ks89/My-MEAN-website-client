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

    //-----------------------------
    //--- 3dauth authentication ---
    //----------------------------
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

    var isAuth3dLoggedIn = function() {
      var token3dauth = getToken('3dauth');
      console.log("User is logged in with token3dauth " + token3dauth);
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
      getLocalUser : getLocalUser,
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