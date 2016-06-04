(function () {

  angular
  .module('mySiteApp')
  .controller('projectListCtrl', projectListCtrl);

  projectListCtrl.$inject = ['projectsData', 'logServer'];
  function projectListCtrl (projectsData, logServer) {
    var vm = this;
    
    vm.pageHeader = {
      title: 'Projects',
      strapline: ''
    };
    
    
    logServer.debug("Debug errore");


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

        //vm.projects = data;
        if(data && data.length > 0) {
          const ellips = "...";
          var subStr = "";
          const maxLength = 100;

          vm.projects = data.map(function(project, index, array) {
            subStr = project.shortDescription.substring(0,maxLength);
            if(subStr.length >= maxLength) {
              subStr = subStr + ellips;
            }
            //update all shortDescriptions
            project.shortDescription = subStr;
            console.log("map shortDescription: " + project.shortDescription);
            return project;
          });
        }
      })
      .error(function (e) {
        console.log(e);
        vm.message = "Sorry, something's gone wrong, please try again later";
      });
    }

  })();