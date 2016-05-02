'user strict';
(function() {

  angular
    .module('mySiteApp')
    .service('projectsData', projectsData);

  projectsData.$inject = ['$http'];
  function projectsData ($http) {
   
    console.log('service projectsData called');

    var projectList = function () {
      return $http.get('/api/projects');
    };

    var projectById = function (projectid) {
      return $http.get('/api/projects/' + projectid);
    };

    var projectListForHomepage = function () {
      return $http.get('/api/projecthome');
    };

    return {
      projectList : projectList,
      projectById: projectById,
      projectListForHomepage: projectListForHomepage
    };
  }

})();