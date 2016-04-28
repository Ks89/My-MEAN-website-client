(function () {

  angular
    .module('mySiteApp')
    .directive('hrefCallFunctionController', hrefCallFunctionController);

  function hrefCallFunctionController () {
    return {
        scope: { unlinkByServiceName: '&functionToCall' },
        link: function(scope, element, attrs) {
            var url = attrs.href;
            var servicename = attrs.servicename;
            console.log("url:" + url + ", servicename:" + servicename);

            element.attr('href', url);
           
            element.bind('click', function() {
        		console.log('clicked');
        		scope.unlinkByServiceName({arg1: servicename});
            });
        }
    };
  }
})();