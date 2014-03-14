/* Module: GUI
*
* Takes care of work related to creation and loading of GUI elements
*/
var GUI = (function () {
    var my = {};
    
    var _layers = [];
    
    var UILayer = function (config) {
        /* This is the overlay interface layer object. */
        return {
            id          : config.id,
            ui_location : config.ui_location,
            ui_elements : [],
            show : function () {
                /* Show interface layer just above canvas. */
                
                // Iterate on all elements and show
                for (var i = 0; i < ui_elements.length; i++) {
                    ui_elements[i].show();
                }
            }
        };
    };
    
    return my;
}());

/*
* GUI sub-module that holds the different UI elements
*/
GUI.objects = (function () {
    return {
        button : function () {
        
        },
        
    };
}());