sap.ui.define(['sap/ui/core/UIComponent'],
    function(UIComponent) {
        "use strict";
        return UIComponent.extend("odataui5project.Component",{
            metadata:{
                manifest:"json"
            },
            init:function(){
                // set UI component as parent component so we can access methods of parent component
                debugger;
                 UIComponent.prototype.init.apply(this);
               // define router object of UI component
                var oRouter = this.getRouter();
                oRouter.initialize();
            },
          //  createContent:function(){
                // var oRootView = new sap.ui.view({
                //     viewName:'sapOdata.view.App',
                //     id:'idRootView',
                //     type:'XML'
                // });
                // var oAppCon = oRootView.byId("idAppCon");
                // var oView1 = new sap.ui.view({
                //     viewName:"sapOdata.view.View1",
                //     type:"XML",
                //     id:"idView1"
                // });
                // var oView2 = new sap.ui.view({
                //     viewName:"sapOdata.view.View2",
                //     type:"XML",
                //     id:"idView2"
                // });
                // var oEmpty = new sap.ui.view({
                //     viewName:"sapOdata.view.Empty",
                //     type:"XML",
                //     id:"idEmpty"
                // });
                // oAppCon.addMasterPage(oView1).addDetailPage(oEmpty).addDetailPage(oView2);
                // return oRootView;
         //   },
            destroy:function(){
                
            }
        });
        
    });