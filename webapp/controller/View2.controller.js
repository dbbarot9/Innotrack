sap.ui.define([
    'odataui5project/controller/BaseController',
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/export/Spreadsheet',
    'sap/ui/export/library',
    'sap/ui/export/ExportBase',
    "sap/ui/core/util/Export", 
    "sap/ui/core/util/ExportTypeCSV"
], function(BaseController,History,MessageBox,MessageToast,Fragment,Filter, FilterOperator, Spreadsheet, exportLibrary, ExportBase, Export, ExportTypeCSV) {
    'use strict';
    var EdmType = exportLibrary.EdmType;
    return BaseController.extend('BaseController',{
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
        onInit:function() {
           // debugger;
            
            this.oRouter = this.getOwnerComponent().getRouter();
        //    this.oRouter = this.getOwnerComponent().getRouter();
           this.oRouter.getRoute("delivery").attachMatched(this.herculis, this);
         //   this.oRouter.getRoute("detail").attachMatched(this.herculis, this);
        
        },
        herculis:function(oEvent){
            debugger;
          
          var data1 = [];
            var sPath = oEvent.getParameter("arguments").vbeln;
            var columnVal = this.getView().byId("idColoumn1");
      //      var sId = oEvent.getParameter("arguments").fruitId;
         //  var sval = "/" + sPath;
         var sval = "/DeliveryTextSet";
      //     var sPath = "/fruits/" + sId;
           this.getView().bindElement(sval);
         //  this.getView().bindElement(sPath);
         var oFilter3 = new Filter("VBELN", FilterOperator.EQ, sPath.substr(19,8));
        // var oFilter3 = new Filter("VBELN", FilterOperator.EQ, sval.substr(20,8));
         data1.push(oFilter3);
       //  var bindInfo = this.getView().byId("Detail").getBinding("items");
           //data1.push(oFilter3);
          //   var oBinding = this.getView().byId("table").getBinding("items","/DeliverySet");
        var oBinding = this.getView().byId("Detail").bindItems({
            path: "/DeliveryTextSet",
            template: columnVal,
            filters: data1
          });
          var model = new sap.ui.model.json.JSONModel();

          this.getView().byId("Detail").bindElement("items",{
            path:"/DeliveryTextSet"
          })
          var tblData = this.getView().byId("Detail");
          tblData.addStyleClass('backgroundColor');
         // var bindInfo1 = this.getView().byId("idPosnr").bindInfo();
        //  var saddress = this.getView().byId("Detail").getBindingContextPath();
        //   this.getView().byId("Detail").bindAggregation("items",
        //     {path:"/DeliveryTextSet",
        //         template: columnVal  
        //     })
        //  this.onExport();
        },
        onExportToExcel: function () {
          // Get the JSON data
          debugger;
          var rows = [];
      var allData =  this.getView().byId('Detail');   
      var selection = allData.getItems();
      selection.forEach(val => {
      var data = val.getBindingContext().getObject();
      rows.push(data);
      });
          // Convert JSON to Excel workbook
          var workbook = XLSX.utils.book_new();
          var worksheet = XLSX.utils.json_to_sheet(rows);
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
          // Save the workbook as an Excel file
          XLSX.writeFile(workbook, "data.xlsx");
      },
        generateExcel: function(oData, that) {
           debugger;
           var oModel = this.getView().getModel();
          // oModel.setSizeLimit(10000);
      //   //  oModel.setData(oData); //oData is the model data which is binding to the table

           var oTable = this.byId('Detail');
           var aColumns = oTable.getColumns();
      //  //   var aItems = oTable.getItems();
       var aItems = oTable.getBinding('items');
          var aTemplate = [];
          for (var i = 0; i < aColumns.length; i++) {

                  var oColumn = {
                      name: aColumns[i].getHeader().getText(),
                      template: {
                          content: {
                              path: null
                          }
                      }
                  };
                  if (aItems.length > 0) {
                      oColumn.template.content.path = aItems[0].getCells()[i].getBinding("text").getPath();
                  }
                  aTemplate.push(oColumn);

          }

      //     var oExport = new Export({
      //         // Type that will be used to generate the content. Own ExportType’s can be created to support other formats
      //         exportType: new ExportTypeCSV({
      //             separatorChar: ",",
      //             dataSource: aItems,
      //             charset: "utf-8"
      //         }),
      //         // Pass in the model created above
      //         models: oModel,
      //         // binding information for the rows aggregation
      //         rows: {
      //             path: "/DeliveryTextSet"
      //         },
      //         // column definitions with column name and binding info for the content
      //         columns: aTemplate
      //     });
      var aCols, oRowBinding, oSettings, oSheet,delNo, oTable;
            debugger;
            if (!this._oTable) {
              this._oTable = this.byId('Detail');
            }
      
            oTable = this._oTable;
            oRowBinding = oTable.getBinding('items');
            aCols = this.createColumnConfig();
          //  exportLibrary.load();
         //   delNo = this.getView().byId('idVbeln').getValue();
           
                var oExport = new Export({
              // Type that will be used to generate the content. Own ExportType’s can be created to support other formats
              exportType: new ExportTypeCSV({
              //  oSettings
                   separatorChar: ";",
                   fileExtension: "csv",
                //   dataSource: aItems,
                   charset: "utf-8"
              }),
              // Pass in the model created above
              models: oModel,
              // binding information for the rows aggregation
              rows: {
                  path: "/DeliveryTextSet(VBELN='80001079',POSNR='900001')" 
                  //oRowBinding.aKeys[1]
              },
              // column definitions with column name and binding info for the content
              columns: aTemplate
          });
          oExport.saveFile().always(function() {
              this.destroy();
          });
      },
        onExport: function() {
            var aCols, oRowBinding, oSettings, oSheet,delNo, oTable;
            var oModel = this.getView().getModel();
            debugger;
            if (!this._oTable) {
              this._oTable = this.byId('Detail');
            }
      
            oTable = this._oTable;
            oRowBinding = oTable.getBinding('items');
            ///sap/opu/odata/SAP/ZINNOTRACK_SRV/DeliveryTextSet?$filter=VBELN eq '80001527'
          //oRowBinding = oModel.getBindings('items');
            aCols = this.createColumnConfig();
          //  exportLibrary.load();
         //   delNo = this.getView().byId('idVbeln').getValue();
            oSettings = {
              workbook: {
                columns: aCols,
                hierarchyLevel: 'Leval'
              },
              
              dataSource: {
                type: 'odata',
             //   dataUrl: '/sap/opu/odata/SAP/ZINNOTRACK_SRV/DeliveryTextSet?$filter=VBELN eq%2080001527%27%27&$format=%27xlsx%27',
                dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
             //   serviceUrl: this._sServiceUrl,
                headers: oModel.getHeaders ? oModel.getHeaders() : null,
                count: oRowBinding.getLength ? oRowBinding.getLength() : null,
                sizeLimit: 400000,
                useBatch: false // Default for ODataModel V2
              },
              fileName: 'Delivery_' + oTable.getItems()[0].getCells()[0].getBinding("text").getValue() + '_track',
              fileType: 'sap.ui.export.FileType.XSLX',
              showProgress: true
             // worker: true // We need to disable worker because we are using a MockServer as OData Service
            };
            debugger;
            oSheet = new Spreadsheet(oSettings);
          //oSheet = new sap.ui.export.ExportBase(oSettings)

           // oSheet.build();
            oSheet.build().finally(function() {
              oSheet.destroy();
            });
          },
          createColumnConfig: function() {
            var aCols = [];
      
            aCols.push({
              label: 'Delivery No',
              property: 'VBELN',
              type: EdmType.String,
            });
            aCols.push({
                label:'Item',
                type:EdmType.String,
                property:'POSNR'
              });
              aCols.push({
                label:'Material',
                type:EdmType.String,
                property:'matnr'
              });
              aCols.push({
                label:'Device',
                type:EdmType.String,
                property:'Device'
              });
              aCols.push({
                label:'Temp',
                type:EdmType.String,
                property:'Temp'
              });
              aCols.push({
                label:'Date',
                type:EdmType.String,
                property:'date'
              });
              aCols.push({
                label:'Latitude',
                type:EdmType.String,
                property:'latitude'
              });
              aCols.push({
                label:'Longitude',
                type:EdmType.String,
                property:'longitude'
              });
              aCols.push({
                label:'Location',
                type:EdmType.String,
                property:'location'
              });
              aCols.push({
                label:'Status',
                type:EdmType.String,
                property:'status'
              });
              aCols.push({
                label:'BatchNo',
                type:EdmType.String,
                property:'batchno'
              });
              aCols.push({
                label:'Light',
                type:EdmType.String,
                property:'light'
              });
              // aCols.push({
              //   label:'Orientation',
              //   type:EdmType.String,
              //   property:'orientation'
              // });
              aCols.push({
                label:'Battery',
                type:EdmType.String,
                property:'battery'
              });
              aCols.push({
                label:'Pressure',
                type:EdmType.String,
                property:'pressure'
              });
              aCols.push({
                label:'Humidity',
                type:EdmType.String,
                property:'humidity'
              });
              aCols.push({
                label:'HU',
                type:EdmType.String,
                property:'hu'
              });
              aCols.push({
                label:'ACCELEROMETER',
                type:EdmType.String,
                property:'ACCELEROMETER'
              });
              

            return aCols;
          },
        onFilter:function(){
            MessageBox.confirm("This functionality is under development.");
        }
   
     });
    
});