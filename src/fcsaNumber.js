(function() {
  var fcsaNumberModule,
    __hasProp = {}.hasOwnProperty;

  fcsaNumberModule = angular.module('fcsa-number', []);

  fcsaNumberModule.directive('fcsaNumber', [
    'fcsaNumberConfig', function(fcsaNumberConfig) {
      var addCommasToInteger, controlKeys, defaultOptions, getOptions, hasMultipleDecimals, isNotControlKey, isNotDigit, isNumber, makeIsValid, makeMaxDecimals, makeMaxDigits, makeMaxNumber, makeMinNumber;
      defaultOptions = fcsaNumberConfig.defaultOptions;
      getOptions = function(scope) {
        var option, options, value, _ref;
        options = angular.copy(defaultOptions);
        if (scope.options != null) {
          _ref = scope.$eval(scope.options);
          for (option in _ref) {
            if (!__hasProp.call(_ref, option)) continue;
            value = _ref[option];
            options[option] = value;
          }
        }
        return options;
      };
      isNumber = function(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
      };
      isNotDigit = function(which) {
        return which < 44 || which > 57 || which === 47;
      };
      controlKeys = [0, 8, 13];
      isNotControlKey = function(which) {
        return controlKeys.indexOf(which) === -1;
      };
      hasMultipleDecimals = function(val, decimalSeparator) {
        if (decimalSeparator == null) {
          decimalSeparator = '.';
        }
        return (val != null) && val.toString().split(decimalSeparator).length > 2;
      };
      makeMaxDecimals = function(maxDecimals, decimalSeparator) {
        var regexString, validRegex;
        if (decimalSeparator == null) {
          decimalSeparator = '.';
        }
        if (maxDecimals > 0) {
          regexString = "^-?\\d*\\" + decimalSeparator + "?\\d{0," + maxDecimals + "}$";
        } else {
          regexString = "^-?\\d*$";
        }
        validRegex = new RegExp(regexString);
        return function(val) {
          return validRegex.test(val);
        };
      };
      makeMaxNumber = function(maxNumber) {
        return function(val, number) {
          return number <= maxNumber;
        };
      };
      makeMinNumber = function(minNumber) {
        return function(val, number) {
          return number >= minNumber;
        };
      };
      makeMaxDigits = function(maxDigits, decimalSeparator) {
        var validRegex;
        if (decimalSeparator == null) {
          decimalSeparator = '.';
        }
        validRegex = new RegExp("^-?\\d{0," + maxDigits + "}(\\" + decimalSeparator + "\\d*)?$");
        return function(val) {
          return validRegex.test(val);
        };
      };
      makeIsValid = function(options) {
        var validations;
        validations = [];
        if (options.maxDecimals != null) {
          validations.push(makeMaxDecimals(options.maxDecimals, options.decimalSeparator));
        }
        if (options.max != null) {
          validations.push(makeMaxNumber(options.max));
        }
        if (options.min != null) {
          validations.push(makeMinNumber(options.min));
        }
        if (options.maxDigits != null) {
          validations.push(makeMaxDigits(options.maxDigits, options.decimalSeparator));
        }
        return function(val) {
          var i, number, _i, _ref;
          if (!isNumber(val)) {
            return false;
          }
          if (hasMultipleDecimals(val, options.decimalSeparator)) {
            return false;
          }
          number = Number(val);
          for (i = _i = 0, _ref = validations.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
            if (!validations[i](val, number)) {
              return false;
            }
          }
          return true;
        };
      };
      addCommasToInteger = function(val, thousandSeparator, decimalSeparator) {
        var commas, decimalRegex, decimals, wholeNumbers, wholeNumbersRegEx;
        if (thousandSeparator == null) {
          thousandSeparator = ',';
        }
        if (decimalSeparator == null) {
          decimalSeparator = '.';
        }
        decimalRegex = new RegExp("^-?\\d+(?=\\" + decimalSeparator + ".)", "");
        decimals = val.indexOf(decimalSeparator) == -1 ? '' : val.replace(decimalRegex, '');
        wholeNumbersRegEx = new RegExp("(\\" + decimalSeparator + "\\d+)$");
        wholeNumbers = val.replace(wholeNumbersRegEx, '');
        commas = wholeNumbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + thousandSeparator);
        return "" + commas + decimals;
      };
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
          options: '@fcsaNumber'
        },
        link: function(scope, elem, attrs, ngModelCtrl) {
          var isValid, options, thousandSepRegEx;
          options = getOptions(scope);
          isValid = makeIsValid(options);
          thousandSepRegEx = new RegExp("\\" + options.thousandSeparator, 'g');
          ngModelCtrl.$parsers.unshift(function(viewVal) {
            var noCommasVal;
            noCommasVal = viewVal.toString().replace(/,/g, '');
            if (isValid(noCommasVal) || !noCommasVal) {
              ngModelCtrl.$setValidity('fcsaNumber', true);
              return noCommasVal;
            } else {
              ngModelCtrl.$setValidity('fcsaNumber', false);
              return void 0;
            }
          });
          ngModelCtrl.$formatters.push(function(val) {
            if ((options.nullDisplay != null) && (!val || val === '')) {
              return options.nullDisplay;
            }
            if ((val == null) || !isValid(val)) {
              return val;
            }
            ngModelCtrl.$setValidity('fcsaNumber', true);
            val = addCommasToInteger(val.toString(), options.thousandSeparator, options.decimalSeparator);
            if (options.prepend != null) {
              val = "" + options.prepend + val;
            }
            if (options.append != null) {
              val = "" + val + options.append;
            }
            return val;
          });
          elem.on('blur', function() {
            var formatter, viewValue, _i, _len, _ref;
            viewValue = ngModelCtrl.$modelValue;
            if ((viewValue == null) || !isValid(viewValue)) {
              return;
            }
            _ref = ngModelCtrl.$formatters;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              formatter = _ref[_i];
              viewValue = formatter(viewValue);
            }
            ngModelCtrl.$viewValue = viewValue;
            return ngModelCtrl.$render();
          });
          elem.on('focus', function() {
            var val;
            val = elem.val();
            if (options.prepend != null) {
              val = val.replace(options.prepend, '');
            }
            if (options.append != null) {
              val = val.replace(options.append, '');
            }
            elem.val(val.replace(thousandSepRegEx, ''));
            return elem[0].select();
          });
          if (options.preventInvalidInput === true) {
            return elem.on('keypress', function(e) {
              if (isNotDigit(e.which) && isNotControlKey(e.which)) {
                return e.preventDefault();
              }
            });
          }
        }
      };
    }
  ]);

  fcsaNumberModule.provider('fcsaNumberConfig', function() {
    var _defaultOptions;
    _defaultOptions = {
      decimalSeparator: '.',
      thousandSeparator: ','
    };
    this.setDefaultOptions = function(defaultOptions) {
      return _defaultOptions = defaultOptions;
    };
    this.$get = function() {
      return {
        defaultOptions: _defaultOptions
      };
    };
  });

}).call(this);
