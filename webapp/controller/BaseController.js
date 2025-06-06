sap.ui.define(['sap/ui/core/mvc/Controller','odataui5project/util/formatter'
], function(Controller,myFormatter) {
    'use strict';
    return Controller.extend('odataui5project.controller.BaseController',{
        formatter:myFormatter
    });
    
});