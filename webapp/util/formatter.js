sap.ui.define([
], function() {
    'use strict';
    return ({
        getDhaval:function(status){
           // debugger;
            var element = this.getOwnerComponent().getModel("json").getProperty('/status');
            for (let index = 0; index < element.length; index++) {
                const statuses = element[index];
                if (status === statuses.key) {
                    status = statuses.value;
                    return status;
                }
                
            }
        },
        getColour:function(state){
            switch (state) {
                case 'A':
                    return state = 'Success';
                    break;
                    case 'O':
                    return state = 'Warning';
                    break;
                    break;
                    case 'D':
                    return state = 'Error';
                    break;
            }
        }
    });
});