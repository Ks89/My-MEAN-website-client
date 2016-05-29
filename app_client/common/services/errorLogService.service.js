// The error log service is our wrapper around the core error
// handling ability of AngularJS. Notice that we pass off to
// the native "$log" method and then handle our additional
// server-side logging.

'user strict';
(function() {

  angular
  .module('mySiteApp')
  .service('errorLogService', errorLogService);

  errorLogService.$inject = ['$log', '$window', 'stacktraceService'];
  function errorLogService ($log, $window, stacktraceService) {

    var log = function( exception, cause ) {
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
        var errorMessage = exception.toString();
        var stackTrace = stacktraceService.print({ e: exception });
          // Log the JavaScript error to the server.
          // --
          // NOTE: In this demo, the POST URL doesn't
          // exists and will simply return a 404.
          // $.ajax({
          //   type: "POST",
          //   url: "/api/logError",
          //   contentType: "application/json",
          //   data: angular.toJson({
          //     errorUrl: $window.location.href,
          //     errorMessage: errorMessage,
          //     stackTrace: stackTrace,
          //     cause: ( cause || "" )
          //   })
          // });
          $.get( "/api/logError/message=" + "dasdasd", function( data ) {
            console.log("result logdebug: " + data);
          });
        } catch ( loggingError ) {
          // For Developers - log the log-failure.
          $log.warn( "Error logging failed" );
          $log.log( loggingError );
        }
    };

    // Return the logging function.
    return {
      log: log
    };  
  }
})();