(function () {

  angular
    .module('mySiteApp')
    .controller('cvCtrl', cvCtrl);

  function cvCtrl () {
    var vm = this;
    vm.pageHeader = {
      title: 'CV',
      strapline: 'Look my CV'
    };
    vm.sidebar = {
      content: "CV page"
    };
    vm.message = "CV page";

  }

})();