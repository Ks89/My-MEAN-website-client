// The error log service is our wrapper around the core error
// handling ability of AngularJS. Notice that we pass off to
// the native "$log" method and then handle our additional
// server-side logging.

'user strict';
(function() {

  angular
  .module('mySiteApp')
  .service('errorLogService', errorLogService);

  errorLogService.$inject = ['$log', '$window'];
  function errorLogService ($log, $window) {

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

        console.log("CALLEDDDDD");
console.log("0");
        var url = '/api/logDebug';
        var errorMessage = exception.toString();

        console.log("1");
        //var stackframes = [new StackFrame('fn', undefined, 'file.js', 32, 1)];


        var callback = function(stackframes) {
          console.log("2");
            var stringifiedStack = stackframes.map(function(sf) {
                return sf.toString();
            }).join('\n');
            console.log("3");
            console.log(stringifiedStack);
            StackTrace.report(stackframes, url, errorMessage)
            .then(function (data) {
              console.log("data: " + data);
            })
            .catch(function(response) {
              console.log("response: " + response);
            });

        };

        var errback = function(err) { 
          console.log("4");
          console.log(err.message); 
        };

        StackTrace.get().then(callback).catch(errback);

        // StackTrace.get()
        // .then( function(data) {
        //   console.log("2");
        //   console.log("###########################");
        //   console.log(data);
        //   // var stackframes = StackTrace.get();
        // })
        // .catch( function(reason) {
        //   console.log("3");
        //     console.log('('+reason+')');
        // });

        
        console.log("5");
        // StackTrace.report(stackframes, url, errorMessage).then(callback, done.fail)['catch'](done.fail);

        // var postRequest = jasmine.Ajax.requests.mostRecent();
        // postRequest.respondWith({status: 201, contentType: 'text/plain', responseText: 'OK'});

        // function callback() {
        //     expect(postRequest.data()).toEqual({message: errorMessage, stack: stackframes});
        //     expect(postRequest.method).toBe('post');
        //     expect(postRequest.url).toBe(url);
        //     done();
        // }

        // console.log("errorMessage: " + errorMessage);
        // var stackTrace = stacktraceService.print({ e: exception });
        // console.log("stackTrace: " + stackTrace);
        // var data = {
        //   errorUrl: $window.location.href,
        //   errorMessage: errorMessage,
        //   stackTrace: stackTrace,
        //   cause: ( cause || "" )
        // };
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
          // console.error("data is:");
          // console.error(JSON.stringify(data));
          // $.get( "/api/logError/message=" + JSON.stringify(data), function( data ) {
          //   console.log("result logdebug: " + JSON.stringify(data));
          // });
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