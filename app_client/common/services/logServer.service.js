// The error log service is our wrapper around the core error
// handling ability of AngularJS. Notice that we pass off to
// the native "$log" method and then handle our additional
// server-side logging.
'user strict';
(function() {

  angular
  .module('mySiteApp')
  .service('logServer', logServer);

  logServer.$inject = ['$log', '$window'];
  function logServer ($log, $window) {

    var error = function( exception, cause ) {
      // Pass off the error to the default error handler
      // on the AngualrJS logger. This will output the
      // error to the console (and let the application
      // keep running normally for the user).
      // $log.error.apply( $log, arguments );
      // Now, we need to try and log the error the server.
      // --
      // NOTE: In production, I have some debouncing
      // logic here to prevent the same client from
      // logging the same error over and over again! All
      // that would do is add noise to the log.
      try {
        console.log("Called logServer");

        const url = '/api/log/logError';
        const errorMessage = exception.toString();

        StackTrace.get()
        .then(function(stackframes) {
          const stringifiedStack = stackframes.map(function(sf) {
            return sf.toString();
          }).join('\n');

          const dataToSend = {
            errorUrl: $window.location.href,
            errorMessage: errorMessage,
            //stackTrace: stackTrace,
            cause: ( cause || "" )
          };

          const dataToSendString = JSON.stringify(dataToSend);

          console.log("dataToSendString: " + dataToSendString);

          StackTrace.report(stackframes, url, dataToSendString)
          .then(function (data) {
            console.log("data: " + data);
          })
          .catch(function(response) {
            console.log("response: " + response);
          });
        })
        .catch(function(err) { 
          console.log("Stacktrace error on report.");
          console.log(err.message); 
        });

        console.log("logServer finished!");
  
        } catch (loggingError) {
          // For Developers - log the log-failure.
          $log.warn( "Error logging failed" );
          $log.log(loggingError);
        }
    };

    var debug = function( exceptionMsg ) {
      try {
        console.log("Called logServer");

        const url = '/api/log/logDebug';
        const error = new Error(exceptionMsg);
        const errorMessage = error.toString();


        StackTrace.fromError(error)
        .then(function() {
          
          console.log("errorMessage: " + errorMessage);

          StackTrace.report(null, url, errorMessage)
          .then(function (data) {
            console.log("data: " + data);
          })
          .catch(function(response) {
            console.log("response: " + response);
          });
        })
        .catch(function(err) { 
          console.log("Stacktrace error on report.");
          console.log(err); 
        });

        console.log("logServer finished!");
  
        } catch (loggingError) {
          // For Developers - log the log-failure.
          $log.warn( "Error logging failed" );
          $log.log(loggingError);
        }
    };

    // Return the logging function.
    return {
      error: error,
      debug: debug
    };  
  }
})();