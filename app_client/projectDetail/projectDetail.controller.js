(function () {

  angular
  .module('mySiteApp')
  .controller('projectDetailCtrl', projectDetailCtrl);

  projectDetailCtrl.$inject = ['$location', '$routeParams', '$anchorScroll', 'projectsData'];
  function projectDetailCtrl ($location, $routeParams, $anchorScroll, projectsData) {
    var vm = this;
    vm.projectid = $routeParams.projectid;

    vm.images = []; 

    // vm.scrollTo = function (destination) {
    //   return $location.path() + '#' + destination;
    // };

    vm.scrollTo = function(id) {
         var old = $location.hash();
    $location.hash(id);
    $anchorScroll();
    //reset to old to keep any additional routing logic from kicking in
    $location.hash(old);
    
      // $location.hash(id);
      // $anchorScroll();
    }

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