describe('homeCtrl', function() {

  var $httpBackend, $rootScope, createController, projectHome;

  beforeEach(module('mySiteApp'));

  const mockSlide = {
    header: 'SPF',
    image: 'http://placehold.it/1000x400',
    text: 'text',
    id: 0
  };

  const mockThumb = {
    header: 'SPF',
    image: 'http://placehold.it/140x140',
    text: 'text',
    viewButtonLink: "/projects/" + "dfg34gervfdbdf"
  };

  const mockBigThumb = {
    header: 'SPF',
    image: 'http://placehold.it/500x500',
    text: 'text'
  };

  var mockResponse = [{ 
    _id:"dfg34gervfdbdf",
    authors: [{
      name: "dasdasdas",
      surname:"dsadasd",
      url:"http://shjdjhdj",
      urlAvailable:true
    }],
    changelog:"../html/projects/bya/changelog.html",
    description:"../html/projects/bya/description.html",
    features:"../html/projects/bya/features.html",
    futureExtensions:"../html/projects/bya/future_extensions.html",
    gallery:[{
      description:"Image 1",
      img:"/images/projects/spf/1.png",
      thumb:"/images/projects/spf/1.png"
    }],
    iconPath:"/images/projects/project_icons/spf.png",
    lastUpdate:"2013-07-15T2::0.000Z",
    license:"apache-v2",
    licenseText:"../html/projects/bya/license.html",
    name:"SPF",
    projectHomeView: {
      bigThumbImagePath:"http://placehold.it/500x500",
      bigThumbText:"text",
      carouselImagePath:"http://placehold.it/1000x400",
      carouselText:"text",
      thumbImagePath:"http://placehold.it/140x140",
      thumbText:"text"
    },
    releases:"../html/projects/bya/releases.html",
    shortDescription:"dsffsduhfsduaf asfyhasfuas fy8shfuiqw fUWQHBFUIWEBQ fewhfuwfnoeiwb ewuhfiewn",
    tags: ["java se", "maven", "university"],
    url:"http:/github.com/deib-polimi/SPF2",
    visible:true
  }];


  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    projectDataServiceHandler = $httpBackend.when('GET', '/api/projecthome').respond(mockResponse);

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('homeCtrl', {'$scope' : $rootScope });
    };
  }));

  // makes sure all expected requests are made by the time the test ends
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  it('should fetch authentication token', function() {
    $httpBackend.expectGET('/api/projecthome');
    var controller = createController();

    //expect($rootScope.slides[0].projectHomeView.carouselImagePath).toEqual("htp://placehold.it/1000x400");
    console.log(controller.thumbs[0]);

    expect(controller.message).toEqual('Welcome to my website');

    expect(controller.pageHeader.title).toEqual('KS');

    $httpBackend.flush();

    expect(controller.slides[0]).toEqual(mockSlide);
    expect(controller.thumbs[0]).toEqual(mockThumb);
    expect(controller.bigThumbs[0]).toEqual(mockBigThumb);

  });
});
