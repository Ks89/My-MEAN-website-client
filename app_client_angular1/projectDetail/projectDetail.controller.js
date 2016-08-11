(function () {

  angular
  .module('mySiteApp')
  .controller('projectDetailCtrl', projectDetailCtrl);

  projectDetailCtrl.$inject = ['$scope', '$location', '$routeParams', '$anchorScroll', 'projectsData'];
  function projectDetailCtrl ($scope, $location, $routeParams, $anchorScroll, projectsData) {
    var vm = this;
    vm.projectid = $routeParams.projectid;

    vm.images = []; 

    // vm.scrollTo = function (destination) {
    //    return $location.path() + '#' + destination;
    // };

    //it's mandatory to use $scope, because it's called by bs-docs-sidebar.js
    $scope.scrollTo = function(id) {
      var old = $location.hash();
      $location.hash(id);
      $anchorScroll();
      $anchorScroll.yOffset = 50;
      //reset to old to keep any additional routing logic from kicking in
      $location.hash(old);
    };

    projectsData.projectById(vm.projectid)
    .success(function(data) {
      vm.data = { project: data };
      vm.pageHeader = {
        title: vm.data.project.name
      };

      data.gallery.forEach(function (element, index) {
        vm.images.push(element);
      });

      console.log(vm.data);
    })
    .error(function (e) {
      console.log(e);
    });
  }
})();