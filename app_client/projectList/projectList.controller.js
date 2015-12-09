(function () {

  angular
  .module('mySiteApp')
  .controller('projectListCtrl', projectListCtrl);

  projectListCtrl.$inject = ['$scope', 'projectsData','_'];
  function projectListCtrl ($scope, projectsData, _) {
    var vm = this;
    
    vm.pageHeader = {
      title: 'Projects',
      strapline: ''
    };
    
    //init the timeline into the sidebar
    vm.sidebarTitle = "What can you do?";
    vm.sidebar = {
      timeline: [
        { 
          title: "Discover",
          body: "Check my projects on GitHub.",
          icon: "search",
          color: "badge"
        },
        { 
          title: "Like",
          body: "Star the project that you like.",
          icon: "star",
          color: "danger"
        },
        { 
          title: "Improve",
          body: "Fork a project to enhance it.",
          icon: "plus",
          color: "warning"
        },
        { 
          title: "Collaborate",
          body: "Create a pull request with your improvements.",
          icon: "user",
          color: "info"
        },
        { 
          title: "Share",
          body: "Share the project with your friends or on the web.",
          icon: "globe",
          color: "success"
        }
    ]};

    vm.message = "Searching for projects";
    
    projectsData.projectList()
    .success(function(data) {
      console.log(data);
      vm.message = data.length > 0 ? "" : "No projects found";
      
      vm.data = { projects: data };
      
      var ellips = "...";
      var subStr = "";
      var maxLength = 100;

      data.forEach(function(currentValue, index, array) {
        subStr = currentValue.shortDescription.substring(0,maxLength);
        if(subStr.length >= maxLength) {
          subStr = subStr.concat(ellips);
        }
        //update all shortDescriptions
        vm.data.projects[index].shortDescription = subStr;
      });
    })
    .error(function (e) {
      console.log(e);
      vm.message = "Sorry, something's gone wrong, please try again later";
    });

    vm.showError = function (error) {
      $scope.$apply(function() {
        vm.message = error.message;
      });
    };
  }

})();