'user strict';
(function () {
  angular
  .module('mySiteApp')
  .factory('_', underscore);

  underscore.$inject = ['$window'];
  function underscore ($window) {
    return $window._;
  }
})();