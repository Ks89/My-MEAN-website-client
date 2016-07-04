describe('projectListCtrl', function() {

  var $httpBackend, $rootScope, createController, logServer;

  beforeEach(module('mySiteApp'));

  var mockResponse = [
    {
      "_id": "57632b61009f08db1623b606",
      "name": "BYAManager",
      "url": "https://github.com/Ks89/BYAManager",
      "iconPath": "/images/projects/project_icons/byamanager.png",
      "description": "../html/projects/bya/description.html",
      "shortDescription": "dsffsduhfsduaf asfyhasfuas fy8shfuiqw fUWQHBFUIWEBQ fewhfuwfnoeiwb ewuhfiewn",
      "license": "apache-v2",
      "licenseText": "../html/projects/bya/license.html",
      "visible": true,
      "projectHomeView": {
        "carouselImagePath": "http://placehold.it/1000x400",
        "carouselText": "sdjs fshfs fhfsdhf",
        "thumbImagePath": "http://placehold.it/150x150",
        "thumbText": "sfsfasf",
        "bigThumbImagePath": "http://placehold.it/500x500",
        "bigThumbText": "dasdasdas",
        "_id": "577acf770c1a4b750b063847"
      },
      "lastUpdate": "2013-07-15T22:00:00.000Z",
      "filePaths": [],
      "gallery": [
        {
          "thumb": "/images/projects/byamanager/1.jpg",
          "img": "/images/projects/byamanager/1.jpg",
          "description": "Image 1"
        },
        {
          "thumb": "/images/projects/byamanager/2.png",
          "img": "/images/projects/byamanager/2.png",
          "description": "Image 2"
        }
      ],
      "futureExtensions": [
        "../html/projects/bya/future_extensions.html"
      ],
      "features": [
        "../html/projects/bya/features.html"
      ],
      "releases": [
        "../html/projects/bya/releases.html"
      ],
      "changelog": [
        "../html/projects/bya/changelog.html"
      ],
      "tags": [
        "java se",
        "maven",
        "university"
      ],
      "authors": [
        {
          "name": "dasdasdas",
          "surname": "dsadasd",
          "url": "http://shjdjhdj",
          "urlAvailable": true
        }
      ]
    },
    {
      "_id": "57632b61009f08db1623b605",
      "name": "SPF",
      "url": "https://github.com/deib-polimi/SPF2",
      "iconPath": "/images/projects/project_icons/spf.png",
      "description": "../html/projects/bya/description.html",
      "shortDescription": "dsffsduhfsduaf asfyhasfuas fy8shfuiqw fUWQHBFUIWEBQ fewhfuwfnoeiwb ewuhfiewn",
      "license": "apache-v2",
      "licenseText": "../html/projects/bya/license.html",
      "visible": false,
      "projectHomeView": {
        "carouselImagePath": "http://placehold.it/1000x400",
        "carouselText": "sdjs fshfs fhfsdhf",
        "thumbImagePath": "http://placehold.it/150x150",
        "thumbText": "sfsfasf",
        "bigThumbImagePath": "http://placehold.it/500x500",
        "bigThumbText": "dasdasdas",
        "_id": "577acf780c1a4b750b063848"
      },
      "lastUpdate": "2013-07-15T22:00:00.000Z",
      "filePaths": [],
      "gallery": [
        {
          "thumb": "/images/projects/spf/1.png",
          "img": "/images/projects/spf/1.png",
          "description": "Image 1"
        },
        {
          "thumb": "/images/projects/spf/2.png",
          "img": "/images/projects/spf/2.png",
          "description": "Image 2"
        }
      ],
      "futureExtensions": [
        "../html/projects/bya/future_extensions.html"
      ],
      "features": [
        "../html/projects/bya/features.html"
      ],
      "releases": [
        "../html/projects/bya/releases.html"
      ],
      "changelog": [
        "../html/projects/bya/changelog.html"
      ],
      "tags": [
        "java se",
        "maven",
        "university"
      ],
      "authors": [
        {
          "name": "dasdasdas",
          "surname": "dsadasd",
          "url": "http://shjdjhdj",
          "urlAvailable": true
        }
      ]
    }
  ];


  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    projectDataServiceHandler = $httpBackend.when('GET', '/api/projects').respond(mockResponse);

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');
    logServer = $injector.get('logServer');

    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function() {
      return $controller('projectListCtrl', {'$scope' : $rootScope });
    };
  }));

  // makes sure all expected requests are made by the time the test ends
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  it('should check if controller responds correctly with mocked services', function() {
    $httpBackend.expectGET('/api/projects');
    var controller = createController();

    expect(controller.pageHeader.title).toEqual('Projects');
    expect(controller.sidebarTitle).toEqual('What can you do?');
    expect(controller.sidebar.timeline.length).toEqual(5);
    expect(controller.message).toEqual('Searching for projects');

    $httpBackend.flush();

    console.log(controller.projects[0]);    

    expect(controller.projects[0].name).toEqual(mockResponse[0].name);
    expect(controller.projects[1].gallery[0].thumb).toEqual(mockResponse[1].gallery[0].thumb);
    expect(controller.projects[1].tags[0]).toEqual(mockResponse[1].tags[0]);

  });
});
