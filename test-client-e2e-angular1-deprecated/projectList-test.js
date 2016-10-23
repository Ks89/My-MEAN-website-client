'use strict';

describe('MyWebsite', function() {

  it('should automatically redirect to /home when location hash/fragment is empty', function() {
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

      element.all(by.repeater('project in vm.projects')).then(function(project) {
        var titleElement0 = project[0].element(by.binding('project.name'));
        var titleElement1 = project[1].element(by.binding('project.name'));
        var titleElement2 = project[2].element(by.binding('project.name'));

        expect(titleElement0.getText()).toEqual('BYAManager');
        expect(titleElement1.getText()).toEqual('SPF');
        expect(titleElement2.getText()).toEqual('Superapp');
      });
    });


    it('should filter projects by name in projects page', function() {

      expect(browser.getLocationAbsUrl()).toMatch("/projects");

      element(by.model('search.name')).sendKeys('BYA');

      element.all(by.repeater('project in vm.projects')).then(function(project) {
       var titleElement0 = project[0].element(by.binding('project.name'));

       expect(titleElement0.getText()).toEqual('BYAManager');
       expect(project[1]).toEqual(undefined);
       expect(project[2]).toEqual(undefined);
      });

    });

  });
});