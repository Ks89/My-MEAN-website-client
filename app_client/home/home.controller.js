(function () {

  angular
  .module('mySiteApp')
  .controller('homeCtrl', homeCtrl);

  homeCtrl.$inject = ['projectsData'];
  function homeCtrl (projectsData) {
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
    vm.myInterval = 3000;
    vm.noWrapSlides = false;
    vm.active = 0;
    var currIndex = 0;

    //variables for carousel, thumbnails and big thumbnails
    vm.slides = [];
    vm.thumbs = [];
    vm.bigThumbs = [];

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
      vm.slides.push({
        header: cHeader,
        image: cImagePath,
        text: cText,
        id: currIndex++
      });
    };
    var addThumbs = function(tImagePath, tText, tHeader, tPath) {
      vm.thumbs.push({
        header: tHeader,
        image: tImagePath,
        text: tText,
        viewButtonLink: tPath
      });
    };
    var addBigThumbs = function(tbImagePath, tbText, tbHeader) {
      vm.bigThumbs.push({
        header: tbHeader,
        image: tbImagePath,
        text: tbText
      });
    };

  }

})();