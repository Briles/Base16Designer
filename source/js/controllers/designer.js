module.exports = function ($scope) {
  'use strict';

  var data = require('../constants.js');
  $scope.BASE16_SCHEMES = data.BASE16_SCHEMES;
  $scope.COMMENT_MAP = data.COMMENT_MAP;

  $scope.state = {
    view: 'dark',
    schemeListIsActive: false,
  };

  // Colorpicker
  $scope.colorpicker = {};

  $scope.colorpickerShow = function () {
    var id = $scope.toHex(this.n);
    $scope.colorpicker.color = getColor(id);
    $scope.colorpicker.caller = 'base' + id;
    $scope.colorpicker.isActive = true;
  };

  $scope.updatePaletteColor = function () {
    var color = tinycolor($scope.colorpicker.color);

    if (color.isValid()) {
      var id = $scope.colorpicker.caller;
      $scope.scheme[id] = color.toHex();
    }
  };

  function getColor(id) {
    return '#' + $scope.scheme['base' + id];
  }

  $scope.toHex = function (n) {
    return 0 + n.toString(16).toUpperCase();
  };

  $scope.fetchSwatchBack = function (n) {
    return getColor($scope.toHex(n));
  };

  $scope.fetchSwatchFore = function (n) {
    return tinycolor
      .mostReadable(getColor($scope.toHex(n)), [getColor('00'), getColor('07')])
      .toHexString();
  };

  $scope.getBase16Scheme = function (schemeName) {
    for (var i = $scope.BASE16_SCHEMES.length - 1; i >= 0; i--) {
      var fetchedScheme = $scope.BASE16_SCHEMES[i];
      if (fetchedScheme.scheme === schemeName) return angular.copy(fetchedScheme);
    }
  };

  $scope.setScheme = function (schemeName) {
    $scope.colorpicker.isActive = false;
    console.log('Setting "Workspace" Scheme to "' + schemeName + '"');
    $scope.scheme = $scope.getBase16Scheme(schemeName);
  };

  $scope.setScheme('Default');

  if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement) {
      var O = Object(this);
      var len = parseInt(O.length) || 0;
      if (len === 0) {
        return false;
      }

      var n = parseInt(arguments[1]) || 0;
      var k;
      if (n >= 0) {
        k = n;
      } else {
        k = len + n;
        if (k < 0) {
          k = 0;
        }
      }

      var currentElement;
      while (k < len) {
        currentElement = O[k];
        if (searchElement === currentElement ||
          (searchElement !== searchElement && currentElement !== currentElement)) {
          return true;
        }

        k++;
      }

      return false;
    };
  }
};
