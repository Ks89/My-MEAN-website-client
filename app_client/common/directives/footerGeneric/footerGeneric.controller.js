'user strict';
(function () {

  angular
  .module('mySiteApp')
  .controller('footerGenericController', footerGenericController);

  footerGenericController.$inject = ['$location'];
  function footerGenericController($location) {
    var vm = this;

    vm.currentPath = $location.path();

    vm.copyrightMessage = 'Stefano Cappa 2015-2016';
  } 
})();
 