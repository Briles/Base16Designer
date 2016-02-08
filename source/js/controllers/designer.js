module.exports = function($scope)
{
    const constants = require('../constants.js');
    $scope.BASE16_SCHEMES = constants.BASE16_SCHEMES;
    $scope.COLOR_MAP = constants.COLOR_MAP;
    $scope.COMMENT_MAP = constants.COMMENT_MAP;

    var lStore = localStorage;
    var designer = {};
    $scope.designer = designer;
    $scope.workspace = angular.fromJson(lStore.getItem("workspace")) ||
    {};

    // Updates the workspace in localStorage
    designer.updateStorage = function()
    {
        console.log('Saving Workspace to local storage');
        lStore.setItem('workspace', angular.toJson($scope.workspace));
    };

    // Deletes everything in localStorage
    // designer.clearStorage = function()
    // {
    //     $scope.workspace = {};
    //     designer.updateStorage();
    // };

    designer.getBase16Scheme = function(schemeName)
    {
        var fetchedScheme;
        for (var i = $scope.BASE16_SCHEMES.length - 1; i >= 0; i--)
        {
            fetchedScheme = $scope.BASE16_SCHEMES[i];

            if (fetchedScheme.scheme === schemeName) break;
        }
        return fetchedScheme;
    };

    designer.setScheme = function(schemeName)
    {

        if ($scope.workspace.scheme !== schemeName)
        {
            console.log('Setting "Workspace" Scheme to "' + schemeName + '"');
            $scope.workspace.scheme = designer.getBase16Scheme(schemeName);
            designer.updateStorage();
            return $scope.workspace.scheme;
        }
    };

    designer.setFontStyle = function()
    {
        $scope.state.fontStyle = $scope.state.fontStyle === 'normal' ? 'italic' : 'normal';
        console.log('Setting "Font Style" to "' + $scope.state.fontStyle + '"');
        designer.updateStorage();
    };

    designer.setFontWeight = function()
    {
        $scope.state.fontWeight = $scope.state.fontWeight === 'bold' ? 'normal' : 'bold';
        console.log('Setting "Font Weight" to "' + $scope.state.fontWeight + '"');
        designer.updateStorage();
    };

    $scope.state = $scope.workspace.state ||
    {
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
        colors:
        {},
    };
    $scope.colorpicker = colorpicker;

    colorpicker.populatePicker = function(color, caller)
    {
        var colors = $scope.colorpicker.colors;

        colorpicker.caller = caller;
        colors.tinycolor = new colr().fromHex(color);
        colors.hex = colors.tinycolor.toHex();
        colors.rgb = colors.tinycolor.toRgbObject();
        colors.hsl = colors.tinycolor.toHslObject();
        colors.hsv = colors.tinycolor.toHsvObject();
    };

    colorpicker.updateColor = function(format, themeid)
    {
        var hexcolor = null,
            rgbcolor = null,
            hslcolor = null,
            hsvcolor = null,
            hexcolorisValid = true,
            rgbcolorisValid = true,
            hslcolorisValid = true,
            hsvcolorisValid = true;

        try
        {
            hexcolor = new colr().fromHex(colorpicker.colors.hex);
        }
        catch (e)
        {
            hexcolorisValid = false;
        }

        try
        {
            rgbcolor = new colr().fromRgbObject(colorpicker.colors.rgb);
        }
        catch (e)
        {
            rgbcolorisValid = false;
        }

        try
        {
            hslcolor = new colr().fromHslObject(colorpicker.colors.hsl);
        }
        catch (e)
        {
            hslcolorisValid = false;
        }

        try
        {
            hsvcolor = new colr().fromHsvObject(colorpicker.colors.hsv);
        }
        catch (e)
        {
            hsvcolorisValid = false;
        }

        if (format === 'hex' && hexcolorisValid)
        {
            colorpicker.colors.rgb = hexcolor.toRgbObject();
            colorpicker.colors.hsl = hexcolor.toHslObject();
            colorpicker.colors.hsv = hexcolor.toHsvObject();
        }

        if (format === 'rgb' && rgbcolorisValid)
        {
            colorpicker.colors.hex = rgbcolor.toHex();
            colorpicker.colors.hsl = rgbcolor.toHslObject();
            colorpicker.colors.hsv = rgbcolor.toHsvObject();
        }

        if (format === 'hsl' && hslcolorisValid)
        {
            colorpicker.colors.hex = hslcolor.toHex();
            colorpicker.colors.rgb = hslcolor.toRgbObject();
            colorpicker.colors.hsv = hslcolor.toHsvObject();
        }

        if (format === 'hsv' && hsvcolorisValid)
        {
            colorpicker.colors.hex = hsvcolor.toHex();
            colorpicker.colors.rgb = hsvcolor.toRgbObject();
            colorpicker.colors.hsl = hsvcolor.toHslObject();
        }

        if (colorpicker.caller !== null)
        {
            if (hexcolorisValid && rgbcolorisValid && hexcolorisValid && hsvcolorisValid)
            {
                $scope.workspace.scheme[colorpicker.caller] = hexcolor.toHex().substring(1);
                designer.updateStorage();
            }
        }
        console.log(colorpicker.colors);
    };

    $scope.copySuccess = function(e)
    {
        var oldMsg = e.trigger.getAttribute('aria-label');
        e.trigger.setAttribute('aria-label', 'Copied!!');

        setTimeout(function()
        {
            e.trigger.setAttribute('aria-label', oldMsg);
        }, 1000);
        e.clearSelection();
    };
};
