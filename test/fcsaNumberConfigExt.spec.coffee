# extended fcsa config tests

describe 'fcsaNumberConfigExt', ->
  $scope = undefined
  $compile = undefined

  beforeEach ->
    testModule = angular.module 'testModule', []
    testModule.config (fcsaNumberConfigProvider) ->
      fcsaNumberConfigProvider.setDefaultOptions {
        minDecimals: 2
        decimalSeparator: '#'
        thousandSeparator: '_'
      }

    module 'fcsa-number', 'testModule'

    inject(($rootScope, _$compile_) ->
      $scope = $rootScope
      $compile = _$compile_
      $scope.model = { number: 0 }
    )

  describe 'on focus', ->
    it 'removes the (custom) commas', ->
      $scope.model.number = 1000.5
      el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope)
      el = el[0]
      $scope.$digest()
      angular.element(document.body).append el
      angular.element(el).triggerHandler 'focus'
      expect(el.value).toBe '1000#50'

  describe 'on blur', ->
    it 'adds (custom) commas', ->
      $scope.model.number = 1000.5
      el = $compile("<input type='text' name='number' ng-model='model.number' fcsa-number />")($scope)
      el = el[0]
      $scope.$digest()
      angular.element(document.body).append el
      angular.element(el).triggerHandler 'focus'
      angular.element(el).triggerHandler 'blur'
      expect(el.value).toBe '1_000#50'

  # Not going to test the rest of the options because the code structure
  # is such that if one default option works, then all the default options work
