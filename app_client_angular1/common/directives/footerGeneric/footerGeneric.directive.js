'user strict';
(function () {

  angular
    .module('mySiteApp')
    .directive('footerGeneric', footerGeneric);

  function footerGeneric () {
    return {
    	restrict: 'EA',
	    templateUrl: '/common/directives/footerGeneric/footerGeneric.template.html',
	    scope: true,
	    transclude : false,
	    controller: 'footerGenericController as foovm'
    };
  }

})();