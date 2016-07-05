'use strict';

describe('MyWebsite', function() {

  it('should automatically redirect to /home when location hash/fragment is empty', function() {
    browser.get('/');
    expect(browser.getLocationAbsUrl()).toMatch("/home");
  });

  it('should have a title', function() {
    expect(browser.getTitle()).toEqual('StefanoCappa.it');
  });

  describe('home', function() {

    beforeEach(function() {
      browser.get('/home');
    });

    it('should render home page when user navigates to /home', function() {
      expect(browser.getLocationAbsUrl()).toMatch("/home");

      var first= element.all(by.repeater('thumb in vm.thumbs')).get(0);
      first.getText().then(function (txt) {
         expect(txt).toEqual('BYAManager');
      });

      // var second= element.all(by.repeater('thumb in vm.thumbs')).get(1);
      // second.getText().then(function (txt) {
      //    expect(txt).toEqual('SPF');
      // });

      // var third= element.all(by.repeater('thumb in vm.thumbs')).get(2);
      // third.getText().then(function (txt) {
      //    expect(txt).toEqual('Superapp');
      // });


      // element.all(by.repeater('thumb in vm.thumbs')).then(function(thumbs) {

      //   var headerElement0 = thumbs[0].element(by.binding('thumb.header'));
      //   var headerElement1 = thumbs[1].element(by.binding('thumb.header'));
      //   var headerElement2 = thumbs[2].element(by.binding('thumb.header'));

      //   // var textElement0 = thumbs[0].element(by.binding('thumb.text'));
      //   // var textElement1 = thumbs[1].element(by.binding('thumb.text'));
      //   // var textElement2 = thumbs[2].element(by.binding('thumb.text'));

      //   // console.log(headerElement0.getText());
      //   // console.log(headerElement1.getText());
      //   // console.log(headerElement2.getText());
      //   // console.log(textElement0.getText());
      //   // console.log(textElement1.getText());
      //   // console.log(textElement2.getText());

      //   headerElement0.getText().then(function (txt) {
      //     console.log(txt);
      //     expect(txt).toEqual('BYAManager');
      //   });

      //   expect(headerElement0.getText()).toEqual('BYAManager');
      //   // expect(headerElement1.getText()).toEqual('SPF');
      //   // expect(headerElement2.getText()).toEqual('Superapp');
      //   // expect(textElement0.getText()).toEqual('sdjs fshfs fhfsdhf');
      //   // expect(textElement1.getText()).toEqual('sdjs fshfs fhfsdhf');
      //   // expect(textElement2.getText()).toEqual('sdjs fshfs fhfsdhf');
      // });
    });

  });
});