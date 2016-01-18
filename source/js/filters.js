var app = angular.module('Base16Designer');

// Prepends '#' to hex color for use in CSS
// app.filter('hexStr', function()
// {
//     return function(input)
//     {
//         return input[0] === '#' ? input : '#' + input;
//     };
// });

// Prepends '#' to hex color for use in CSS
app.filter('strReplace', function()
{
    return function(input, needle, haystack)
    {
        if (input === null) return input;
        return input.replace(needle, haystack);

    };
});
