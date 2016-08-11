(function () {

  angular
  .module('mySiteApp')
  .controller('aboutCtrl', aboutCtrl);

  function aboutCtrl() {
    var vm = this;

    vm.pageHeader = {
      title: 'About',
      strapline: 'Infos and credits'
    };
    vm.main = {
      content: 'This site was created to show my projects.\n\nAnd other stuff...'
    };
  }

})();