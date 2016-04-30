'user strict';
(function () {

  angular
    .module('mySiteApp')
    .directive('hrefCallFunctionController', hrefCallFunctionController);

  hrefCallFunctionController.$inject = ['$location'];
  function hrefCallFunctionController ($location) {
    return {
        scope: { unlinkByServiceName: '&functionToCall' },
        link: function(scope, element, attrs) {
            var url = attrs.href;
            var servicename = attrs.servicename;
            console.log("url:" + url + ", servicename:" + servicename);

            //var elementPath = element.attr('href', url);
            scope.$location = location;
            scope.$watch('$location.path()', function(locationPath) {
                console.log('change location!!!');
                scope.unlinkByServiceName({arg1: servicename});
                element.attr('href', url);
            });

          //   element.bind('click', function() {
        		// console.log('clicked unlinking');
        		// scope.unlinkByServiceName({arg1: servicename});
          //       console.log('clicked redirecting to href');
          //       element.attr('href', url);

          //   });
        }
    };
  }
})();