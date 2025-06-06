sap.ui.define([
	"odataui5project/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/unified/Menu",
	"sap/m/MessageToast",
	'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
	"sap/ui/unified/MenuItem"
], function(Controller, History, JSONModel, Device, Menu, MessageToast, Filter, FilterOperator, MenuItem) {
	"use strict";
	var oJSONModel = new JSONModel(); 
	return Controller.extend("BaseController", {
		callView1:function(){
			// var oAppView = this.getView().getParent().getParent();
			// var oEmpty = oAppView.getDetailPages()[0];
			// oAppView.to(oEmpty);
		  //  debugger;
		  //  this.oRouter = this.getOwnerComponent().getRouter();
		  //  this.oRouter.navTo("home");
		  var oHistory = History.getInstance();
			 var sPreviousHash = oHistory.getPreviousHash();
		 if (sPreviousHash !== undefined) {
				 window.history.go(-1);
			 } else {
				 var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				 oRouter.navTo("home");
			 }
		 },

		onInit: function () {
			// New code for Map

			// var startadress = "Baden+Württemberg";
		 		 
			// var lat;
			// var lon;
			
			  window.oGeoMap = this.getView().byId("vbi");
			  window.oMapConfig = {
			 		   "MapProvider": [{
						   "name": "Openstreetmap",
						   "copyright": "<b><a href='http://www.openstreetmap.org/copyright'>© openstreetmap</a></b>",
						   "Source": [{
							   "id": "s1",
							   "url": "http://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
							   }, {
							   "id": "s2",
							   "url": "http://b.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
							   }, {
							   "id": "s3",
							   "url": "http://c.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
							   }
							   ]
			 		   }],
					   "MapLayerStacks": [{
							   "name": "DEFAULT",
							   "MapLayer": {
									   "name": "layer1",
									   "refMapProvider": "Openstreetmap",
									   "opacity": "1",
									   "colBkgnd": "RGB(255,255,255)"
							   }
					   }]
				   };
			 window.oGeoMap.setMapConfiguration(window.oMapConfig);
			 window.oGeoMap.setRefMapLayerStack("DEFAULT");
			 window.oGeoMap.setInitialZoom(1);
			   
			// New Code End for MAP
			this.oRouter = this.getOwnerComponent().getRouter();
			   this.oRouter.getRoute("map").attachMatched(this.herculis, this);
			},
			 herculis:function(oEvent){
				debugger;
				var data1 = [];
            var sPath = oEvent.getParameter("arguments").VBELN;
            var columnVal = this.getView().byId("idColoumn1");
      //      var sId = oEvent.getParameter("arguments").fruitId;
         //  var sval = "/" + sPath;
         var sval = "/DelMapSet";
      //     var sPath = "/fruits/" + sId;
           this.getView().bindElement(sval);
         //  this.getView().bindElement(sPath);
       //  var oFilter3 = new Filter("VBELN", FilterOperator.EQ, sPath.substr(19,8));
	   var oFilter3 = new Filter({
		filters: [new Filter("VBELN", FilterOperator.EQ, sPath.substr(19,8)),
				  new Filter("POSNR", FilterOperator.EQ, sPath.substr(36,2))
				], 
				and:true
			});
        // var oFilter3 = new Filter("VBELN", FilterOperator.EQ, sval.substr(20,8));
         data1.push(oFilter3);
		// Define your OData Model
var oModel = this.getView().getModel();

// Define the path to the entity set, including the key value of the record you want to fetch
var sEntityPath = "/DelMapSet(VBELN='" + sPath.substr(19,8) + "',POSNR='"+ sPath.substr(36,2) +"')";  // Example entity with key value "123"
var that = this;
    // Get the JSON model from the view (this is already defined in manifest)
    var oJSONModel = this.getView().getModel("json");
// Use the read method to fetch the data
oModel.read(sEntityPath, {
    success: function(oData, response) {
        console.log("Data fetched successfully", oData);
		debugger;
		var latitude = oData.LATITUDE;   // Replace with actual property
        var longitude = oData.LONGITUDE; // Replace with actual property
		var location = oData.LOCATION;
		var address1 = oData.ADDRESS1;
		var address2 = oData.ADDRESS2;

		// Set the flattened data to the JSON model
		oJSONModel.setProperty("/jModel",oData);
    },
    error: function(oError) {
        console.error("Error fetching data", oError);
    }
});
		
        //   this.getView().byId("mapRoute1").bindProperty("position",{
        //     path:"/DelMapSet",
		// 	filters: data1
        //   })
       //  var bindInfo = this.getView().byId("Detail").getBinding("items");
           //data1.push(oFilter3);
          //   var oBinding = this.getView().byId("table").getBinding("items","/DeliverySet");
        // var oBinding = this.getView().byId("vbi").bindProperty({
        //     path: "/DelMapSet",
		// 	sName:'mapRoute'
        //  //   template: columnVal
        //    // filters: data1
        //   });
         // var model = new sap.ui.model.json.JSONModel();

        //   this.getView().byId("Detail").bindElement("items",{
        //     path:"/DeliveryTextSet"
        //   })
        //   var tblData = this.getView().byId("Detail");
        //   tblData.addStyleClass('backgroundColor');
			 },
			 
			 callView1:function(){
				// var oAppView = this.getView().getParent().getParent();
				// var oEmpty = oAppView.getDetailPages()[0];
				// oAppView.to(oEmpty);
			  //  debugger;
			  //  this.oRouter = this.getOwnerComponent().getRouter();
			  //  this.oRouter.navTo("home");
			  var oHistory = History.getInstance();
				 var sPreviousHash = oHistory.getPreviousHash();
			 if (sPreviousHash !== undefined) {
					 window.history.go(-1);
				 } else {
					 var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					 oRouter.navTo("home");
				 }
			 }
        //     var map = L.map('map').setView([37.7749, -122.4194], 10); // Set initial view to San Francisco

        //     // Add OpenStreetMap tile layer
        //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //       maxZoom: 19,
        //       attribution: '© OpenStreetMap'
        //     }).addTo(map);
      
        //     // Add a marker
        //     L.marker([37.7749, -122.4194]).addTo(map)
        //       .bindPopup('San Francisco')
        //       .openPopup();
        //   }
        });
			// var oModel = new JSONModel("test-resources/sap/ui/vbm/demokit/sample/GeoMapRoutes/Data.json");
			// this.getView().setModel(oModel);

			// // set the device model
			// var oDeviceModel = new JSONModel(Device);
			// oDeviceModel.setDefaultBindingMode("OneWay");
			// this.getView().setModel(oDeviceModel, "device");
     //   }
        });
    

		
		// onClickRoute: function (evt)	{
		// 	// MessageToast.show("Route onClick");
		// 	evt.getSource().openDetailWindow("My Detail Window", "0", "0" );
		// },

	// 	onContextMenuRoute: function ( evt )	{
	// 		if ( evt.getParameter("menu") ) {
	// 			// Function to handle the select event of the items
	// 			var handleSelect = function(oEvent){
	// 				MessageToast.show("clicked on " + oEvent.getSource().getText());
	// 			};

	// 			// Create the menu items
	// 			var oMenu11 = evt.getParameter("menu");
	// 			oMenu11.addItem(
	// 				new MenuItem({
	// 					text: "First Item",
	// 					select: handleSelect
	// 				})
	// 			);
	// 			oMenu11.addItem(
	// 				new MenuItem({
	// 					text: "Second Item",
	// 					select: handleSelect,
	// 					submenu: new Menu({
	// 						ariaDescription: "a sub menu",
	// 						items: [
	// 							new MenuItem({
	// 								text: "New TXT file",
	// 								tooltip: "Creates a new TXT file.",
	// 								select: handleSelect
	// 							}),
	// 							new MenuItem({
	// 								text: "New RAR file",
	// 								tooltip: "Creates a new RAR file.",
	// 								select: handleSelect
	// 							})
	// 						]
	// 					})
	// 				})
	// 			);
	// 			oMenu11.addItem(
	// 				new MenuItem({
	// 					text: "Disabled Item",
	// 					enabled: false
	// 				})
	// 			);

	// 			evt.getSource().openContextMenu( oMenu11 );

	// 		}

	// 	},

	// 	onZoomIn: function() {
	// 		this.byId("vbi").zoomToGeoPosition(10, 51, 5);
	// 	},

	// 	onCloseDetail: function (evt) {
	// 		// MessageToast.show("onCloseDetail" + this);
	// 	},

	// 	onOpenDetail: function (evt) {
	// 		var cont = document.getElementById(evt.getParameter("contentarea").id);
	// 		cont.innerHTML = "Content for Routes";
	// 		cont.style.color = "Blue";
	// 	}

	// });

 //});
