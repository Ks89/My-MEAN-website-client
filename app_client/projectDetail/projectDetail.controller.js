(function () {

  angular
    .module('mySiteApp')
    .controller('projectDetailCtrl', projectDetailCtrl);

  projectDetailCtrl.$inject = ['$location', '$routeParams', 'projectsData'];
  function projectDetailCtrl ($location, $routeParams, projectsData) {
    var vm = this;
    vm.projectid = $routeParams.projectid;

    vm.images = []; 

    vm.scrollTo = function (destination) {
      return $location.path() + '#' + destination;
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
    };
})();