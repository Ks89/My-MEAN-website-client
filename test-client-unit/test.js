describe('homeCtrl', function() {
  beforeEach(module('mySiteApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.grade', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = {}; 
      controller = $controller('homeCtrl', { $scope: $scope });
    });

    it('sets the strength to "strong" if the password length is >8 chars', function() {
      expect($scope.pageHeader).not.toBe(null);
      expect($scope.pageHeader.title).toEquals('KS');
    });
  });
});
