(function () {

  angular
  .module('mySiteApp')
  .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['$scope', 'projectsData'];
  function homeCtrl ($scope, projectsData) {
    var vm = this;

    vm.pageHeader = {
      title: 'KS',
      strapline: 'Welcome'
    };
    vm.sidebar = {
      content: "KS sidebar"
    };
    vm.message = "Welcome to my website";
    
    //carousel slides
    $scope.myInterval = 3000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var currIndex = 0;

    //variables for carousel, thumbnails and big thumbnails
    var slides = $scope.slides = [];
    var thumbs = $scope.thumbs = [];
    var bigThumbs = $scope.bigThumbs = [];

    projectsData.projectListForHomepage()
    .success(function(data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          addSlide(
            data[key].projectHomeView.carouselImagePath, 
            data[key].projectHomeView.carouselText, 
            data[key].name);
          addThumbs(
            data[key].projectHomeView.thumbImagePath, 
            data[key].projectHomeView.thumbText, 
            data[key].name,
            "/projects/" + data[key]._id);
          addBigThumbs(
            data[key].projectHomeView.bigThumbImagePath, 
            data[key].projectHomeView.bigThumbText, 
            data[key].name);
        }
      }
    }) 
    .error(function (e) {
      console.log("Sorry, something's gone wrong, please try again later");
    });

    var addSlide = function(cImagePath, cText, cHeader) {
      slides.push({
        header: cHeader,
        image: cImagePath,
        text: cText,
        id: currIndex++
      });
    };
    var addThumbs = function(tImagePath, tText, tHeader, tPath) {
      thumbs.push({
        header: tHeader,
        image: tImagePath,
        text: tText,
        viewButtonLink: tPath
      });
    };
    var addBigThumbs = function(tbImagePath, tbText, tbHeader) {
      bigThumbs.push({
        header: tbHeader,
        image: tbImagePath,
        text: tbText
      });
    };

  }

})();