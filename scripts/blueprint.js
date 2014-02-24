/* Module: BLUEPRINT */

var BLUEPRINT = (function () {
    "use strict";
    var my = {},
        library = [];

    my.add = function (type, url) {
        // Add new blueprint. Form: {identifier: 'value', ...} Must contain a 'name' identifier. For single items
        UTIL.get(url, function (response) {
            library.push([type, JSON.parse(response)]);
        });
    };
    
    my.addMulti = function (type, url, onSuccess, onError) {
        UTIL.get(url, function (response) {
            var arr = JSON.parse(response);
            
            for (var i = 0; i < arr.blueprints.length; i++) {
                library.push([type, arr.blueprints[i]]);
            }
            
            onSuccess(url);
        }, function () {
            onError('Failed loading: ' + url);
        });
    };
    
    my.get = function (name) {
        // Try to retrieve blueprint. If found, return it
        for (var i = 0; i < library.length; i++) {
            if (library[i][1].name === name) {
                return library[i][1];
            }
        }
    };
    
    my.getByType = function (type) {
        var sublib = [];
        for (var i = 0; i < library.length; i++) {
            if (library[i][0] === type) {
                sublib.push(library[i][1]);
            }
        }
        
        return sublib;
    };

    return my;
}());

/*
UTIL.getPromise('json/blueprints/tanks/m4_sherman.json').then(JSON.parse).then(function (bp) {
    BLUEPRINT.add(bp);
});
*/
