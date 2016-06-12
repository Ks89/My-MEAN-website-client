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
      browser.get('index.html#!/projects');
    });

    // var chain = function () {
    //     var defer = protractor.promise.defer();
    //     defer.fulfill(true);
    //     return defer.promise;
    // };



    it('should render projects when user navigates to /projects', function() {
      expect(browser.getLocationAbsUrl()).toMatch("/home#!%2Fprojects");

      var projects = element(by.model('projects'));

     // expect(projects[0].shortDescription).toEqual('dsffsduhfsduaf asfyhasfuas fy8shfuiqw fUWQHBFUIWEBQ fewhfuwfnoeiwb ewuhfiewn');

    });

  });
});