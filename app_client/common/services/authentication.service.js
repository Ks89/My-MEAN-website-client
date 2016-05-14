'user strict';
(function () {
  angular
  .module('mySiteApp')
  .service('authentication', authentication);

  authentication.$inject = ['$q', '$http', '$window', '$log'];
  function authentication ($q, $http, $window, $log) {

    //----------------------------
    //--- local authentication ---
    //----------------------------
    var register = function(user) {
      var deferred = $q.defer();
      $http.post('/api/register', user)
      .success(function(data) {
        console.log('called register - success');
        console.log(data.token);
        saveToken('auth', data.token);
        deferred.resolve(true);
      })
      .error(function (err) {
        // Erase the token if the user fails to log in
        console.log('called register - error');
        removeToken('auth');
        deferred.resolve(false);
      });
      return deferred.promise;
    };


    var login = function(user) {
      var deferred = $q.defer();
      $http.post('/api/login', user)
      .success(function(data) {
        saveToken('auth', data.token);
        deferred.resolve(true);
      })
      .error(function (err) {
        // Erase the token if the user fails to log in
        console.log('called register - error');
        removeToken('auth');
        deferred.resolve(false);
      });
      return deferred.promise;
    };

    var resetPassword = function(emailToken, newPassword) {
      console.log("Called resetEmailToken " + emailToken + ", new pwd: " + newPassword);
      var deferred = $q.defer();
      $http.post('/api/resetNewPassword', 
        { newPassword : newPassword, 
          emailToken : emailToken
        })
        .success(function(data) {
          console.log("resetPassword success");
          deferred.resolve(true);
        })
        .error(function (err) {
          console.log('resetPassword - error');
          deferred.resolve(false);
        });
        return deferred.promise;
    };

    var activateAccount = function(emailToken) {
      console.log("Called activateAccount " + emailToken);
      var deferred = $q.defer();
      $http.post('/api/activateAccount', { emailToken : emailToken })
        .success(function(data) {
          console.log("activateAccount success");
          deferred.resolve(true);
        })
        .error(function (err) {
          console.log('activateAccount - error');
          deferred.resolve(false);
        });
        return deferred.promise;
    };

    var forgotPassword = function(email) {
      console.log("Called forgotPassword " + email);
      var deferred = $q.defer();
      $http.post('/api/reset', { email : email})
        .success(function(data) {
          console.log("forgotPassword success");
          deferred.resolve(true);
        })
        .error(function (err) {
          console.log('forgotPassword - error');
          deferred.resolve(false);
        });
        return deferred.promise;
    };

    var unlink = function(serviceName) {
      console.log("Called unlink " + serviceName);
      return $http.get('/api/unlink/' + serviceName);
    };

    var isAuthLocalLoggedIn = function() {
      console.log("isAuthLocalLoggedIn - reading token: ");
      var deferred = $q.defer();

      getUserByToken('auth')
      .success(function(data) {
        console.log("-------------------------------------------");
        console.log('isAuthLocalLoggedIn user with data: ');
        console.log(data);
        console.log("-------------------------------------------");
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

      getUserByToken('auth')
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
    }

    //---------------------------------------
    //--- local and 3dauth authentication ---
    //---------------------------------------
    //function to call the /users/:id REST API
    var getUserById = function (id) {
      return $http.get('/api/users/' + id);
    };

    var logout = function() {
      console.log("Called authentication logout");
      removeToken('auth');
      
      //call REST service to remove session data from redis
      return $http.get('/api/logout');
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
        console.log('£££££££££££ isLoggedIn - r0: ' + r0 + ', r1: ' + r1 + '. Returning ' + r0 || r1);
        deferred.resolve(r0 || r1);
        //return false;
      }, function(error) {
        console.log('£££££££££££ isLoggedIn error - returning false');
        deferred.resolve(false);
        //return false;
      }).catch(function(err){
        console.log('£££££££££££ isLoggedIn exception catched - returning false');
        deferred.resolve(false);
      });
      return deferred.promise;
    };

    var saveToken = function (key, token) {
      console.log('||||||||||||||||||||||||||||||||||saving token with key: ' + key);
      $window.sessionStorage[key] = token;
    };

    var getTokenRedis = function () {
      return $http.get('/api/sessionToken'); 
    };

    var decodeJwtToken = function(jwtToken) {
      //TODO add an if(jwtToken) or something like that. But remember to use $q or similar here!
      return $http.get('/api/decodeToken/' + jwtToken);
    };

    var getLoggedUser = function() {
      var deferred = $q.defer();
      var thirdauthData = {};
      console.log('<<<<<<< getLoggedUser');
      getTokenRedis('auth')
      .success(function(tokenData) {
        console.log('<<<<<<< token obtained from redis');     
        console.log("<<<<<<< sessionToken " + tokenData + " tokenData.data " + tokenData.data);
        if(tokenData) {
          console.log(tokenData);
          var tokenObj = JSON.parse(tokenData);
          console.log("<<<<<<< tokenobj: " + tokenObj);
          if(tokenObj) {
            var token = tokenObj.token;
            console.log("<<<<<<< real token is: " + token);
            saveToken('auth', token);

            console.log("<<<<<<< reading token: ---------> " + token );

            getUserByToken('auth')
            .success(function(data) {
              console.log('<<<<<<< getUserByToken user ');
              console.log("<<<<<<< getUserByToken token: ---------> " + data );


              if(data !== null && data === 'invalid-data') {
                removeToken('auth');
                //TODO remove session data with logout
                console.log('<<<<<<< INVALID DATA !!!!');
                deferred.reject(null);
              }

              //var userData = JSON.parse(data);
              console.log('<<<<<<< ');
              console.log('<<<<<<<  user');
              console.log('<<<<<<< ');
              console.log('<<<<<<< ' + data);
              if(data) {
                var userData = JSON.parse(data);
                console.log('<<<<<<< ' + userData);
                var user = userData.user;
                console.log('<<<<<<< ' + user);

                if(user._id) {
                  getUserById(user._id)
                  .success(function(data) {
                    console.log('<<<<<<< ' + "Obtained user by its id");
                    console.log('<<<<<<< ' + "getUserByToken finished with local user");
                    console.log('<<<<<<< ' + data);

                    console.log('<<<<<<< ' + "updated user with local infos:");
                    console.log('<<<<<<< ' + user);

                    deferred.resolve(JSON.stringify(user));
                  })
                  .error(function(e) {
                    console.log('<<<<<<< ' + "Impossible to retrieve user by its id");
                    console.log('<<<<<<< ' + "getUserByToken finished without local user");
                    deferred.resolve(JSON.stringify(user));
                  });
                }
              } else {
                removeToken('auth');
                  //TODO remove logout
                  deferred.reject(JSON.stringify({}));
                }  
              })
            .error(function(e) {
              console.log('<<<<<<< ' + 'getUserByToken error ');
              console.log(e);
              removeToken('auth');
              //TODO remove logout
              deferred.reject(JSON.stringify({}));
            });
            console.log('<<<<<<< ' + "getUserByToken finished returning...");
            
          }
        }
      })
      .error(function(e) {
        console.log('<<<<<<< ' + "ERROR experimental...");
        deferred.reject(JSON.stringify({}));
      });
      
      return deferred.promise;
    };


    //-----------------------------------
    //--- others functions - not exposed
    //-----------------------------------
    function getToken(key) {
      return $window.sessionStorage[key];
    }
    function getUserByToken(key) {
      console.log("getUserByToken called method");
      var sessionToken = getToken(key); 
      if(sessionToken) {
        console.log("getUserByToken sessionToken :" + sessionToken);
        var token = sessionToken; //JSON.parse(sessionToken);
        console.log("getUserByToken token ");
        console.log(token);
        return decodeJwtToken(token);
      } else {
        return decodeJwtToken();
      }
    }
    function removeToken(key) {
      $window.sessionStorage.removeItem(key);
    }
    
    return {
      register : register,
      login : login,
      activateAccount : activateAccount,
      resetPassword : resetPassword,
      forgotPassword : forgotPassword,
      unlink : unlink,
      getUserById : getUserById,
      logout : logout,
      getLoggedUser : getLoggedUser,
      isAuthLocalLoggedIn : isAuthLocalLoggedIn,
      isLoggedIn : isLoggedIn,
      saveToken : saveToken,
      getTokenRedis : getTokenRedis,
      decodeJwtToken : decodeJwtToken
    };
  }
})();