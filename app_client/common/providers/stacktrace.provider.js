'user strict';
(function() {

  angular
    .module('mySiteApp')
    .service('errProvider', errProvider);

  errProvider.$inject = ['$exceptionHandler'];
  function errProvider ($exceptionHandler) {

    return {
        $get: function( errorLogService ) {
          return( errorLogService );
        }
      };

  }

})();

