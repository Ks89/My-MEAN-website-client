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
      return $http.post('/api/register', user)
      .success(function (data) {
        console.log('called register - success');
        console.log(data.token);
        saveToken('local', JSON.stringify(data.token));
      })
      .error(function (err) {
        // Erase the token if the user fails to log in
        console.log('called register - error');
        removeToken('local');
      });
    };


    var login = function(user) {
      return $http.post('/api/login', user)
      .success(function(data) {
        saveToken('local', JSON.stringify(data.token));
      });
    };

    var getLocalUser = function() {
      console.log("reading token: ");
      var deferred = $q.defer();

      getUserByToken('local')
      .success(function(data) {
        console.log('getUserByToken user ');

        if(data!=null && data=='invalid-data') {
          removeToken('local');
          deferred.reject(null);
        }

        var user = JSON.parse(data);
        console.log('user:');
        console.log(user);
          //return getUserById(data.user._id);
          if(user) {
            deferred.resolve(user);
          } else {
            removeToken('local');
            deferred.reject({});
          }
        })
      .error(function(e) {
        console.log('getUserByToken error ');
        console.log(e);
        removeToken('local');
        deferred.reject(null);
      });

      return deferred.promise;
    };

    var getLocalAuthCurrentUser = function() {
      if(isLoggedIn()){
        console.log('getLocalAuthCurrentUser');

        var user = getUserByToken('local');
        console.log("getLocalAuthCurrentUser: ");
        console.log(user);
        if(user) {
          return user;
        } else {
          return null;
        }
      } else {
        return null;
      }
    }

    var unlinkLocal = function() {
      removeToken('local');
      return $http.get('/api/unlink/local');
    };

    function isAuthLocalLoggedIn () {
      console.log("reading token: ");
      var deferred = $q.defer();

      getUserByToken('local')
      .success(function(data) {
        console.log('isAuthLocalLoggedIn user ');
        var user = JSON.parse(data);
        console.log('user:');
        console.log(user);
          //return getUserById(data.user._id);
          if(user) {
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        })
      .error(function(e) {
        console.log('isAuthLocalLoggedIn error ');
        console.log(e);
        deferred.resolve(false);
      });

      return deferred.promise;
    };


    //-----------------------------
    //--- 3dauth authentication ---
    //-----------------------------
    function isAuth3dLoggedIn () {
      console.log("reading 3dauth: ");
      var deferred = $q.defer();

      getUserByToken('3dauth')
      .success(function(data) {
        console.log('isAuth3dLoggedIn user ');
        var user = JSON.parse(data);
        console.log('user:');
        console.log(user);
          //return getUserById(data.user._id);
          if(user) {
            deferred.resolve(true);
          } else {
            deferred.resolve(false);
          }
        })
      .error(function(e) {
        console.log('isAuth3dLoggedIn error ');
        console.log(e);
        deferred.resolve(false);
      });

      return deferred.promise;
    };

    var get3dAuthUser = function() {
      if(isAuth3dLoggedIn()) {

        var thirdauthData = {};

        var deferred = $q.defer();
        
        getUserByToken('3dauth')
        .success(function(data) {
          console.log('get3dAuthUser user ');

          if(data!=null && data=='invalid-data') {
            removeToken('3dauth');
            removeCookie('userCookie');
            deferred.reject(null);
          }

          var userData = JSON.parse(data);
          console.log('userData:');
          console.log(userData);
          var user = userData.user;
            //return getUserById(data.user._id);
            if(user) {
              if(user.github) {
                thirdauthData = getThirdAuthData(user.github);
              }
              if(user.google) {
                thirdauthData = getThirdAuthData(user.google); 
              }
              if(user.facebook) {
                thirdauthData = getThirdAuthData(user.facebook);
              }
              if(user.twitter) {
                thirdauthData = getThirdAuthData(user.twitter);
              }   
              deferred.resolve(thirdauthData);
            } else {
              deferred.reject({});
            }
          })
        .error(function(e) {
          console.log('get3dAuthUser error ');
          console.log(e);
          removeToken('3dauth');
          removeCookie('userCookie');
          deferred.reject(null);
        });
      } else {
        removeToken('3dauth');
        removeCookie('userCookie');
        deferred.reject({});
      }
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
      var deferred = $q.defer();

      $q.all([isAuthLocalLoggedIn(), isAuth3dLoggedIn()])
      .then(function(results) {
        console.log("Isloggedin called");
        var r0 = results[0];
        var r1 = results[1];
        console.log(r0);
        console.log(r1);
        deferred.resolve(r0 || r1);
        //return false;
      }, function(error) {
        deferred.resolve(false);
        //return false;
      }).catch(function(err){
        deferred.resolve(false);
      });

      return deferred.promise;

      //local 
      //return isAuthLocalLoggedIn();
      // .then(function(result) {
      //   console.log('isLoggedIn local  Success: ' + result);
      //   return result;
      // }, function(reason) {
      //   console.log('isLoggedIn local  Failed: ' + reason);
      //   return false;
      // });

      //3dauth TODO uncomment and fix this
      // isAuth3dLoggedIn()
      // .then(function(result) {
      //   console.log('isLoggedIn 3dauth  Success: ' + result);
      //   return result;
      // }, function(reason) {
      //   console.log('isLoggedIn 3dauth  Failed: ' + reason);
      //   return false;
      // });
    };

    var saveToken = function (key, token) {
      $window.sessionStorage[key] = token;
    };

    var decodeJwtToken = function(jwtToken) {
      return $http.get('/api/decodeToken/' + jwtToken);
    }

    //-----------------------------------
    //--- others functions - not exposed
    //-----------------------------------
    function getToken(key) {
      return $window.sessionStorage[key];
    };
    function getUserByToken(key) {
      console.log("getUserByToken");
      var sessionToken = getToken(key); 
      if(sessionToken) {
        console.log("getUserByToken sessionToken");
        var token = JSON.parse(sessionToken);
        console.log("getUserByToken token ");
        console.log(token);
        return decodeJwtToken(token);
      } else {
        return decodeJwtToken();
      }
    };
    function removeToken(key) {
      $window.sessionStorage.removeItem(key);
    };
    function removeCookie(key) {
      $cookies.remove(key);
    };
    
    return {
      register : register,
      login : login,
      getLocalUser : getLocalUser,
      getLocalAuthCurrentUser : getLocalAuthCurrentUser,
      unlinkLocal : unlinkLocal,
      isAuth3dLoggedIn : isAuth3dLoggedIn,
      get3dAuthUser : get3dAuthUser,
      getUserById : getUserById,
      logout : logout,
      isLoggedIn : isLoggedIn,
      saveToken : saveToken,
      decodeJwtToken : decodeJwtToken
    };
  }
})();