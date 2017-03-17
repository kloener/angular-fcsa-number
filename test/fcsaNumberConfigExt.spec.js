(function() {
  describe('fcsaNumberConfigExt', function() {
    var $compile, $scope;
    $scope = void 0;
    $compile = void 0;
    beforeEach(function() {
      var testModule;
      testModule = angular.module('testModule', []);
      testModule.config(function(fcsaNumberConfigProvider) {
        return fcsaNumberConfigProvider.setDefaultOptions({
          minDecimals: 2,
          decimalSeparator: '#',
          thousandSeparator: '_'
        });
      });
      module('fcsa-number', 'testModule');
      return inject(function($rootScope, _$compile_) {
        $scope = $rootScope;
        $compile = _$compile_;
        return $scope.model = {
          number: 0
        };
      });
    });
    describe('on focus', function() {
      return it('removes the (custom) commas', function() {
        var el;
        $scope.model.number = 1000.5;
        el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope);
        el = el[0];
        $scope.$digest();
        angular.element(document.body).append(el);
        angular.element(el).triggerHandler('focus');
        return expect(el.value).toBe('1000#50');
      });
    });
    return describe('on blur', function() {
      return it('adds (custom) commas', function() {
        var el;
        $scope.model.number = 1000.5;
        el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope);
        el = el[0];
        $scope.$digest();
        angular.element(document.body).append(el);
        angular.element(el).triggerHandler('focus');
        angular.element(el).triggerHandler('blur');
        return expect(el.value).toBe('1_000#50');
      });
    });
  });

}).call(this);
