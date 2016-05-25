// The "stacktrace" library that we included in the Scripts
// is now in the Global scope; but, we don't want to reference
// global objects inside the AngularJS components - that's
// not how AngularJS rolls; as such, we want to wrap the
// stacktrace feature in a proper AngularJS service that
// formally exposes the print method.
'user strict';
(function () {
  angular
  .module('mySiteApp')
  .factory('stacktraceService', stacktraceService);

  stacktraceService.$inject = [];
  function stacktraceService () {
    return({
        print: printStackTrace
    });
  }
})();