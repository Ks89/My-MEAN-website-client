(function () {

  angular
    .module('mySiteApp')
    .controller('projectDetailCtrl', projectDetailCtrl);

  projectDetailCtrl.$inject = ['$routeParams', 'projectsData'];
  function projectDetailCtrl ($routeParams, projectsData) {
    var vm = this;
    vm.projectid = $routeParams.projectid;

    vm.images = []; 

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