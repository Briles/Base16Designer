module.exports = function ($scope) {
  'use strict';

  require('../helpers.js');
  const constants = require('../constants.js');
  $scope.BASE16_SCHEMES = constants.BASE16_SCHEMES;
  $scope.COLOR_MAP = constants.COLOR_MAP;
  $scope.COMMENT_MAP = constants.COMMENT_MAP;

  var lStore = localStorage;
  var designer = {};
  $scope.designer = designer;
  $scope.workspace = angular.fromJson(lStore.getItem('workspace')) || {};

  // Updates the workspace in localStorage
  designer.updateStorage = function () {
    console.log('Saving Workspace to local storage');
    lStore.setItem('workspace', angular.toJson($scope.workspace));
  };

  designer.getBase16Scheme = function (schemeName) {
    var fetchedScheme;
    for (var i = $scope.BASE16_SCHEMES.length - 1; i >= 0; i--) {
      fetchedScheme = $scope.BASE16_SCHEMES[i];

      if (fetchedScheme.scheme === schemeName) break;
    }

    var clonedScheme = {
      scheme: fetchedScheme.scheme,
      author: fetchedScheme.author,
      base00: fetchedScheme.base00,
      base01: fetchedScheme.base01,
      base02: fetchedScheme.base02,
      base03: fetchedScheme.base03,
      base04: fetchedScheme.base04,
      base05: fetchedScheme.base05,
      base06: fetchedScheme.base06,
      base07: fetchedScheme.base07,
      base08: fetchedScheme.base08,
      base09: fetchedScheme.base09,
      base0A: fetchedScheme.base0A,
      base0B: fetchedScheme.base0B,
      base0C: fetchedScheme.base0C,
      base0D: fetchedScheme.base0D,
      base0E: fetchedScheme.base0E,
      base0F: fetchedScheme.base0F,
    };

    return clonedScheme;
  };

  designer.setScheme = function (schemeName) {
    console.log('Setting "Workspace" Scheme to "' + schemeName + '"');
    $scope.workspace.scheme = designer.getBase16Scheme(schemeName);
    designer.updateStorage();
    return $scope.workspace.scheme;
  };

  designer.setFontStyle = function () {
    $scope.state.fontStyle = $scope.state.fontStyle === 'normal' ? 'italic' : 'normal';
    console.log('Setting "Font Style" to "' + $scope.state.fontStyle + '"');
    designer.updateStorage();
  };

  designer.setFontWeight = function () {
    $scope.state.fontWeight = $scope.state.fontWeight === 'bold' ? 'normal' : 'bold';
    console.log('Setting "Font Weight" to "' + $scope.state.fontWeight + '"');
    designer.updateStorage();
  };

  $scope.state = $scope.workspace.state || {
    view: 'dark',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: 'normal',
    schemeListIsActive: false,
  };
  $scope.workspace.state = $scope.state;

  $scope.workspace.scheme = $scope.workspace.scheme || designer.setScheme('Default');

  // Colorpicker
  var colorpicker = {
    isActive: false,
    caller: null,
    colors: {},
  };
  $scope.colorpicker = colorpicker;

  tinycolor.prototype.toHslObject = function () {
    var hsl = this.toHsl();
    return {
      h: hsl.h.round(0),
      s: (hsl.s * 100).round(0),
      l: (hsl.l * 100).round(0),
    };
  };

  tinycolor.prototype.toHsvObject = function () {
    var hsv = this.toHsv();
    return {
      h: hsv.h.round(0),
      s: (hsv.s * 100).round(0),
      v: (hsv.v * 100).round(0),
    };
  };

  colorpicker.populatePicker = function (color, caller) {
    var colors = $scope.colorpicker.colors;

    colorpicker.caller = caller;
    colors.tinycolor = tinycolor(color);
    colors.hex = colors.tinycolor.toHexString();
    colors.rgb = colors.tinycolor.toRgb();
    colors.hsl = colors.tinycolor.toHslObject();
    colors.hsv = colors.tinycolor.toHsvObject();
  };

  colorpicker.updateColor = function (format) {
    var tinycolors = {
      hex: tinycolor(colorpicker.colors.hex),
      rgb: tinycolor(colorpicker.colors.rgb),
      hsl: tinycolor(colorpicker.colors.hsl),
      hsv: tinycolor(colorpicker.colors.hsv),
    };
    var color = tinycolors[format];
    console.log(color.isValid());
    if (color.isValid()) {

      if (format === 'hex') {
        colorpicker.colors.rgb = color.toRgb();
        colorpicker.colors.hsl = color.toHslObject();
        colorpicker.colors.hsv = color.toHsvObject();
      }

      if (format === 'rgb') {
        colorpicker.colors.hex = color.toHexString();
        colorpicker.colors.hsl = color.toHslObject();
        colorpicker.colors.hsv = color.toHsvObject();
      }

      if (format === 'hsl') {
        colorpicker.colors.hex = color.toHexString();
        colorpicker.colors.rgb = color.toRgb();
        colorpicker.colors.hsv = color.toHsvObject();
      }

      if (format === 'hsv') {
        colorpicker.colors.hex = color.toHexString();
        colorpicker.colors.rgb = color.toRgb();
        colorpicker.colors.hsl = color.toHslObject();
      }

      if (colorpicker.caller !== null) {
        $scope.workspace.scheme[colorpicker.caller] = color.toHex();
        designer.updateStorage();
        console.log(colorpicker.colors);
      }
    }
  };

  $scope.copySuccess = function (e) {
    var oldMsg = e.trigger.getAttribute('aria-label');
    e.trigger.setAttribute('aria-label', 'Copied!!');

    setTimeout(function () {
      e.trigger.setAttribute('aria-label', oldMsg);
    }, 1000);

    e.clearSelection();
  };
};
