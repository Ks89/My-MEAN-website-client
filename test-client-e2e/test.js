'use strict';

describe('my app', function() {


  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/home");
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('StefanoCappa.it');
  });

  describe('projects', function() {

    beforeEach(function() {
      browser.get('/projects');
    });

    // var chain = function () {
    //     var defer = protractor.promise.defer();
    //     defer.fulfill(true);
    //     return defer.promise;
    // };



    it('should render projects when user navigates to /projects', function() {
      
      expect(browser.getLocationAbsUrl()).toMatch("/projects");

// browser.pause();
      // var a = element.all(by.repeater('project in vm.projects')).get(0);

      element.all(by.repeater('project in vm.projects')).then(function(project) {
       var titleElement0 = project[0].element(by.binding('project.name'));
       var titleElement1 = project[1].element(by.binding('project.name'));
       var titleElement2 = project[2].element(by.binding('project.name'));
       expect(titleElement0.getText()).toEqual('SPF');
       expect(titleElement1.getText()).toEqual('BYAManager');
       expect(titleElement2.getText()).toEqual('Superapp');
      });

  

      // var searchName = element(by.model('search.name'));

     // expect(projects[0].shortDescription).toEqual('dsffsduhfsduaf asfyhasfuas fy8shfuiqw fUWQHBFUIWEBQ fewhfuwfnoeiwb ewuhfiewn');

    });

  });
});