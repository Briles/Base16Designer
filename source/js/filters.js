var app = angular.module('Base16Designer');

// Prepends '#' to hex color for use in CSS
app.filter('strReplace', function () {
  'use strict';

  return function (input, needle, haystack) {
    if (input === null) return input;
    return input.replace(needle, haystack);

  };
});
