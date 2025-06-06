sap.ui.define([
    'odataui5project/controller/BaseController',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/odata/v2/ODataModel',
    'sap/m/MessageToast',
    'sap/m/SearchField',
    'sap/m/Token',
    'sap/ui/comp/library',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/type/String',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/ui/table/Column',
    'sap/m/Column',
    "sap/ui/core/Fragment",
    'sap/m/Text',
    'sap/ui/core/date/UI5Date',
    'sap/ui/core/format/DateFormat',
    'sap/ui/export/Spreadsheet',
    'sap/ui/export/library'],
  function(BaseController, Filter, FilterOperator, ODataModel, MessageToast, SearchField, Token, compLibrary, Controller, TypeString, ColumnListItem, Label,  UIColumn, MColumn, Fragment, Text, UI5Date, DateFormat, Spreadsheet, exportLibrary) {
    'use strict';
    var EdmType = exportLibrary.EdmType;
    return BaseController.extend('BaseController', {
      onInit: function () {
        debugger;
        this.oRouter = this.getOwnerComponent().getRouter();
        var oMultiInput;
        var oModel, oView;
       // this.getView().byId('Table').addStyleClass('backgroundColor');
			// Value Help Dialog standard use case with filter bar without filter suggestions
			oMultiInput = this.byId("multiInput");
			oMultiInput.addValidator(this._onMultiInputValidate);
			oMultiInput.setTokens(this._getDefaultTokens());
			this._oMultiInput = oMultiInput;
      },
      onSelect:function(oEvent){
        debugger;
        var ItemData = oEvent.getParameter("listItem");
        var saddress = ItemData.getBindingContextPath();
     //    var oview2 = this.getView().getParent().getParent().getDetailPages()[1];
     //    oview2.bindElement(saddress);
         var sVal = saddress.split("/")[saddress.split("/").length - 1];
       //  var result = "DeliveryTextSet(".concat("'",sVal.substr(19,8),"')");
         this.callView2(sVal);
    },
    callView2:function(sFruitId){
      //   var oAppView = this.getView().getParent().getParent();
      //     var oView2 = oAppView.getDetailPages()[1];
      //   oAppView.to(oView2);
         this.oRouter.navTo("delivery",
                    {
                        vbeln:sFruitId
                    });
    }, 
      	// #region Value Help Dialog standard use case with filter bar without filter suggestions
		onValueHelpRequested: function() {
      debugger;
			this._oBasicSearchField = new SearchField();
			this.loadFragment({
				name: "odataui5project.fragments.ValueHelpDialogFilterBar"
			}).then(function(oDialog) {
				var oFilterBar = oDialog.getFilterBar(), oColumnProductCode;
				this._oVHD = oDialog;

				this.getView().addDependent(oDialog);

				// Set key fields for filtering in the Define Conditions Tab
				oDialog.setRangeKeyFields([{
					label: "Delivery No",
					key: "VBELN",
					type: "string",
					typeInstance: new TypeString({}, {
						maxLength: 10
					})
				}]);

				// Set Basic Search for FilterBar
				oFilterBar.setFilterBarExpanded(false);
				oFilterBar.setBasicSearch(this._oBasicSearchField);

				// Trigger filter bar search when the basic search is fired
				this._oBasicSearchField.attachSearch(function() {
					oFilterBar.search();
				});

				oDialog.getTableAsync().then(function (oTable) {

					oTable.setModel(this.oProductsModel);

					// For Desktop and tabled the default table is sap.ui.table.Table
					if (oTable.bindRows) {
						// Bind rows to the ODataModel and add columns
						oTable.bindAggregation("rows", {
							path: "/VBELN_F4Set",
							events: {
								dataReceived: function() {
									oDialog.update();
								}
							}
						});
						oColumnProductCode = new UIColumn({label: new Label({text: "Delivery No"}), template: new Text({wrapping: false, text: "{VBELN}"})});
						oColumnProductCode.data({
							fieldName: "VBELN"
						});
						// oColumnProductName = new UIColumn({label: new Label({text: "Delivery Item"}), template: new Text({wrapping: false, text: "{POSNR}"})});
						// oColumnProductName.data({
						// 	fieldName: "POSNR"
						// });
						oTable.addColumn(oColumnProductCode);
					//	oTable.addColumn(oColumnProductName);
					}

					// For Mobile the default table is sap.m.Table
					if (oTable.bindItems) {
						// Bind items to the ODataModel and add columns
						oTable.bindAggregation("items", {
							path: "/VBELN_F4Set",
							template: new ColumnListItem({
								cells: new Label({text: "{VBELN}"})
                //, new Label({text: "{POSNR}"})]
							}),
							events: {
								dataReceived: function() {
									oDialog.update();
								}
							}
						});
						oTable.addColumn(new MColumn({header: new Label({text: "Delivery No"})}));
					//	oTable.addColumn(new MColumn({header: new Label({text: "Delivery Item"})}));
					}
					oDialog.update();
				}.bind(this));

				oDialog.setTokens(this._oMultiInput.getTokens());
				oDialog.open();
			}.bind(this));
		},
    onValueHelpOkPress: function (oEvent) {
      debugger;
			var aTokens = oEvent.getParameter("tokens");
			this._oMultiInput.setTokens(aTokens);
			this._oVHD.close();
		},

		onValueHelpCancelPress: function () {
			this._oVHD.close();
		},

		onValueHelpAfterClose: function () {
			this._oVHD.destroy();
		},
    onFilterBarSearch: function (oEvent) {
      debugger;
			var sSearchQuery = this._oBasicSearchField.getValue(),
				aSelectionSet = oEvent.getParameter("selectionSet");

			var aFilters = aSelectionSet.reduce(function (aResult, oControl) {
				if (oControl.getValue()) {
					aResult.push(new Filter({
						path: oControl.getName(),
						operator: FilterOperator.Contains,
						value1: oControl.getValue()
					}));
				}

				return aResult;
			}, []);

			aFilters.push(new Filter({
				filters: [
					new Filter({ path: "VBELN", operator: FilterOperator.Contains, value1: sSearchQuery }),
				//	new Filter({ path: "POSNR", operator: FilterOperator.Contains, value1: sSearchQuery })
				],
				and: false
			}));
      debugger;
			this._filterTable(new Filter({
				filters: aFilters,
				and: true
			}));
		},
    // Internal helper methods
		_getDefaultTokens: function () {
			var ValueHelpRangeOperation = compLibrary.valuehelpdialog.ValueHelpRangeOperation;
			// var oToken1 = new Token({
			// 	key: "80000000",
			// 	text: "000010"
			// });

			// var oToken2 = new Token({
			// 	key: "range_0",
			// 	text: "!(=80000000)"
			// }).data("range", {
			// 	"exclude": true,
			// 	"operation": ValueHelpRangeOperation.EQ,
			// 	"keyField": "VBELN",
			// 	"value1": "80000000",
			// 	"value2": ""
			// });

			// return [oToken1, oToken2];
		},
    _filterTable: function (oFilter) {
			var oVHD = this._oVHD;
      debugger;

			oVHD.getTableAsync().then(function (oTable) {
				if (oTable.bindRows) {
					oTable.getBinding("rows").filter(oFilter);
				}
				if (oTable.bindItems) {
					oTable.getBinding("items").filter(oFilter);
				}

				// This method must be called after binding update of the table.
				oVHD.update();
			});
		},
//END CODE VALUE HELP
      onF4Delivery:function(oEvent){
         //Take a snapshot of the table cell field on which F4 was fired
         this.oField = oEvent.getSource().getValue();
         var that = this;
         //IF lo_alv IS NOT INITIAL
         //Simple IF to check if we already by chance have the object of popup created previously
         if(this.oCityPopup == null){
             //Not created before
             Fragment.load({
                 fragmentName: 'odataui5project.fragments.popup',
                 type: 'XML',
                 id: 'Delivery',
                 controller: this
             })
             //then is a promise once the fragment is loaded --get the fragment object here
             .then(function(oFragment){
                 that.oCityPopup = oFragment;
                 that.oCityPopup.setTitle("Delivery Number");
                 that.oCityPopup.setMultiSelect(true);
                 //explicitly allowing parasite to access body parts using immune system
                 //immune system = View , parasite = fragment, body part = model
                 that.getView().addDependent(that.oCityPopup);
                 that.oCityPopup.bindAggregation("items",{
                     path: '/VBELN_F4Set',
                     template: new sap.m.StandardListItem({
                         title: '{VBELN}',
                         description: ''
                     })
                 });
                 that.oCityPopup.open();
             });
         }else{
             //Already created
             this.oCityPopup.open();
         }
      },
      onSearchPopup: function (oEvent) {
        //Step1: extract the value search by user
        var sVal = oEvent.getParameter("value");
        //Step2: Build the filter object
        var oFilter = new Filter("VBELN", FilterOperator.Contains, sVal);
        //Step3: Get the binding of source control (select dialog)
        var oBinding = oEvent.getSource().getBinding("items");
        //Step4: Inject the filter
        oBinding.filter(oFilter);
    },
    
    onPopupConfirm: function(oEvent){
      debugger;
      var sId = oEvent.getSource().getId();
   //var sId = oEvent.getSource().getValue();
      //Step1: Find which item was selected by user
      var oSelectedItem = oEvent.getParameter("selectedItem");
      //Step2: Extract the title of selected item
      var sText = oSelectedItem.getTitle();
      if(sId.indexOf("VBELN") !== -1){
          //Set the value to the cell of the table on which F4 was fired
          this.oField.setValue(sText);
      }else{
          //here we will write logic for filtering data inside the table
          //Step 1: get all selected items in the popup fragment
          var aItems = oEvent.getParameter("selectedItems");
          //Step 2: Loop over each item and make a filter array
          var aFilters = [];
          for (let i = 0; i < aItems.length; i++) {
              const element = aItems[i];
              var oFilter = new Filter("VBELN", FilterOperator.EQ, element.getTitle());
              aFilters.push(oFilter);
              
          }
          //Step 3: Make a global filter with OR condition
          var oFinalFilter = new Filter({
              filters: aFilters,
              and: false
          });
         // debugger;
          //Step 4: Get the table object
          var oTable = this.getView().byId("table");
          //Step 5: Get the binding of the table
          var oBinding = oTable.getBinding("items");
          //Step 6: inject filter to the binding
         // oBinding.filter([new Filter(new Filter({filters:oFinalFilter}),sId)]);
      }
      
      
  },

      
      onSearch: function (oEvent) {
        var element = '';
        var data1 = [];
        var data2 = [];
        debugger;
        var vbeln = this.getView().byId("multiInput").getTokens();
        var vbeln1 = this.getView().byId("multiInput").getValue();
        if(vbeln1 != '')
        {
          data1.push(new Filter({
            path: "VBELN",
            value1: vbeln1,
            operator: FilterOperator.Contains,
          }));
        }
        var vbeln = this.getView().byId("multiInput").getTokens();
        for (let index = 0; index < vbeln.length; index++) {
          // length equal to 9
          if (vbeln[index].getText().length === 9) {
           // greater then 
           if (vbeln[index].getText()[0] === ">") {
            data1.push(new Filter({
              path: "VBELN",
              value1: vbeln[index].getText().substr(1,8),
              operator: FilterOperator.GT,
            }));
           } 
           // less then
           else if (vbeln[index].getText()[0] === "<") {
            data1.push(new Filter({
              path: "VBELN",
              value1: vbeln[index].getText().substr(1,8),
              operator: FilterOperator.LT,
            }));
           } 
           // not equal to
           else if (vbeln[index].getText()[0] === "!") {
            data1.push(new Filter({
              path: "VBELN",
              value1: vbeln[index].getText().substr(1,8),
              operator: FilterOperator.NE,
            }));
           } 
           // equal to
           else if (vbeln[index].getText()[0] === "=") {
            data1.push(new Filter({
              path: "VBELN",
              value1: vbeln[index].getText().substr(1,8),
              operator: FilterOperator.EQ,
            }));
           } 
       //   }
       // length equal to 10
          } else if (vbeln[index].getText().length === 10) {
            // greater equal
            if (vbeln[index].getText().substr(0,2) === ">=") {
              data1.push(new Filter({
                path: "VBELN",
                value1: vbeln[index].getText().substr(2,8),
                operator: FilterOperator.GE,
              }));
             } 
             // less equal
             if (vbeln[index].getText().substr(0,2) === "<=") {
              data1.push(new Filter({
                path: "VBELN",
                value1: vbeln[index].getText().substr(2,8),
                operator: FilterOperator.LE,
              }));
             } 
             if (vbeln[index].getText().substr(0,1) === '*' && vbeln[index].getText().substr(9,1) === '*') {
              data1.push(new Filter({
                path: "VBELN",
                value1: vbeln[index].getText().substr(1,8),
                operator: FilterOperator.Contains,
              }));
             } 
             if (vbeln[index].getText().substr(0,10) === "!<(empty)>") {
              data1.push(new Filter({
                path: "VBELN",
                value1: '*',
                operator: FilterOperator.Contains,
              }));
             } 
          }else if (vbeln[index].getText().length > 12 && vbeln[index].getText().substr(8,3) === '...') {
            data1.push(new Filter({
              path: "VBELN",
              value1: vbeln[index].getText().substr(0,8),
              value2: vbeln[index].getText().substr(11,8),
              operator: FilterOperator.BT,
            }));
          }
          else if (vbeln[index].getText().length === 12 && vbeln[index].getText().substr(0,3) === '!(=') {
            data1.push(new Filter({
              path: "VBELN",
              value1: vbeln[index].getText().substr(3,8),
            //  value2: vbeln[index].getText().substr(11,8),
              operator: FilterOperator.NE,
            }));
          }
          else if (vbeln[index].getText().length === 7 && vbeln[index].getText().substr(0,7) === "<empty>"){
            data1.push(new Filter({
              path: "VBELN",
              value1: '',
              operator: FilterOperator.EQ,
            }));
          }
          else {
            data1.push(new Filter({
              path: "VBELN",
              value1: vbeln[index].getText(),
              operator: FilterOperator.EQ,
       //   }
        }));
          }
        }
     //   var kunnr = this.getView().byId("ipKunnr").getValue();
     var oDateFr = DateFormat.getDateInstance({
      pattern: "YYYYMMdd"
     });
        var dateFrom = oDateFr.format(this.getView().byId("DRS1").getFrom());
        var dateTo = oDateFr.format(this.getView().byId("DRS1").getTo());
        //Step1 : get the object of the list control
        var oCombo = this.getView().byId("idCombo");
        //Step2: get the selected items from the list
        var oComboData = oCombo.getSelectedItems();
        for (let index = 0; index < oComboData.length; index++) {
          data1.push(new Filter({
            path: "KUNNR",
            operator: FilterOperator.EQ,
            value1: oComboData[index].getText()
          }));
        }

        var columnVal = this.getView().byId("idColoumn");
        var oFilter3 = new Filter("ERDAT", FilterOperator.BT, dateFrom, dateTo);
        data1.push(oFilter3);
       
        //   var oBinding = this.getView().byId("table").getBinding("items","/DeliverySet");
        var oBinding = this.getView().byId("table").bindItems({
          path: "/DeliverySet",
          template: columnVal,
          filters: data1
        });
        var table =  this.getView().byId("table");
        table.addStyleClass('backgroundColor');
      },
      handleValueHelp: function (oEvent) {
        debugger;
        var sInputValue = oEvent.getSource().getValue(),
          oView = this.getView();
  
        // create value help dialog
        if (!this._pValueHelpDialog) {
          this._pValueHelpDialog = Fragment.load({
            id: oView.getId(),
            name: "odataui5project.fragments.popup",
            controller: this
          }).then(function (oValueHelpDialog) {
            oView.addDependent(oValueHelpDialog);
            return oValueHelpDialog;
          });
        }
  
        this._pValueHelpDialog.then(function (oValueHelpDialog) {
          // create a filter for the binding
          oValueHelpDialog.getBinding("items").filter([new Filter(
            "VBELN",
            FilterOperator.Contains,
            sInputValue
          )]);
          // open value help dialog filtered by the input value
          oValueHelpDialog.open(sInputValue);
        });
      },
      
      _handleValueHelpSearch: function (evt) {
        debugger;
        var sValue = evt.getParameter("value");
        var oFilter = new Filter(
          "VBELN",
          FilterOperator.Contains,
          sValue
        );
        evt.getSource().getBinding("items").filter([oFilter]);
      },
  
      _handleValueHelpClose: function (evt) {
        debugger;
        var aSelectedItems = evt.getParameter("selectedItems"),
          oMultiInput = this.getView().byId("multiInput");
  
        if (aSelectedItems && aSelectedItems.length > 0) {
          aSelectedItems.forEach(function (oItem) {
            oMultiInput.addToken(new Token({
              text: oItem.getTitle()
            }));
          });
        }
      },
      onClickDel: function(oEvent){
        debugger;
        debugger;
        var ItemData = oEvent.getSource();
        var saddress = ItemData.getBindingContext().sPath;
     //    var oview2 = this.getView().getParent().getParent().getDetailPages()[1];
     //    oview2.bindElement(saddress);
         var sVal = saddress.split("/")[saddress.split("/").length - 1];
       //  var result = "DeliveryTextSet(".concat("'",sVal.substr(19,8),"')");
         this.callView2(sVal);
      },
      onClickLoc: function(oEvent){
        debugger;
        var ItemData = oEvent.getSource();
        var saddress = ItemData.getBindingContext().sPath;
      //  var sdata = saddress.replace("/DeliverySet","");
     //    var oview2 = this.getView().getParent().getParent().getDetailPages()[1];
     //    oview2.bindElement(saddress);
       //  var sVal = saddress.substr(20,8);
       //  var sVal2 = saddress.substr(37,2);
         var sVal = saddress.split("/")[saddress.split("/").length - 1];
        // var sVal2 = saddress.split("/")[saddress.split("/").length - 1];
     //   var sdata = sVal.replace("DeliverySet","");
       //  var result = "DeliveryTextSet(".concat("'",sVal.substr(19,8),"')");
        //  sVal.replace("DeliverySet","DelMap");  var svaldata = "/DelMap(VBELN='80001079',POSNR='10')";
         this.callView3(sVal);
      },
      callView3:function(sFruitId){
        //   var oAppView = this.getView().getParent().getParent();
        //     var oView2 = oAppView.getDetailPages()[1];
        //   oAppView.to(oView2);
           this.oRouter.navTo("map",
                      {
                          VBELN:sFruitId
                      });
      }, 
      onListItemPress: function (oEvent) {
        debugger;
      //   var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
			// 	productPath = oEvent.getSource().getBindingContext("vbeln").getPath(),
			// 	product = productPath.split("/").slice(-1).pop();

			// this.oRouter.navTo("View2", {layout: oNextUIState.layout, product: product});

			// var oItem = oEvent.getSource();
			// oItem.setNavigated(true);
			// var oParent = oItem.getParent();
			// // store index of the item clicked, which can be used later in the columnResize event
			// this.iIndex = oParent.indexOfItem(oItem);
      },
      onNext: function(sId){
        // //Step 1 : go to mother - app container object
        // var oAppCon = this.getView().getParent().getParent();
        // //Step 2: mother will call second child - navigate to view2
        // //how you obtained the view 2 object to pass here?
        // var oView2 = oAppCon.getDetailPages()[1];
        // //pass the object of the view2
        // oAppCon.toDetail(oView2);
        debugger;
        this.oRouter.navTo("detail",{
            id: sId
        });
    },
      handleChange: function (oEvent) {
        debugger;
        var sFrom = oEvent.getParameter("from"),
            sTo = oEvent.getParameter("to"),
          bValid = oEvent.getParameter("valid"),
          oEventSource = oEvent.getSource();
        //  oText = this.byId("TextEvent");
  
        this._iEvent++;
  
       // oText.setText("Id: " + oEventSource.getId() + "\nFrom: " + sFrom + "\nTo: " + sTo);
  
        // if (bValid) {
        //   oEventSource.setValueState(ValueState.None);
        // } else {
        //   oEventSource.setValueState(ValueState.Error);
        // }
      },
      onExport: function() {
        var aCols, oRowBinding, oSettings, oSheet, oTable;
        debugger;
        if (!this._oTable) {
          this._oTable = this.byId('table');
        }
  
        oTable = this._oTable;
        oRowBinding = oTable.getBinding('items');
        aCols = this.createColumnConfig();
  
        oSettings = {
          workbook: {
            columns: aCols,
            hierarchyLevel: 'Leval'
          },
          dataSource: oRowBinding,
          fileName: 'Innotracker.xlsx',
          worker: false // We need to disable worker because we are using a MockServer as OData Service
        };
        debugger;
        oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function() {
          oSheet.destroy();
        });
      },
      // onListItemPress: function (oEvent) {
      //   var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
      //     productPath = oEvent.getSource().getBindingContext("DeliverySet").getPath(),
      //     product = productPath.split("/").slice(-1).pop();
  
      //   this.oRouter.navTo("detail", {layout: oNextUIState.layout, product: product});
  
      //   var oItem = oEvent.getSource();
      //   oItem.setNavigated(true);
      //   var oParent = oItem.getParent();
      //   // store index of the item clicked, which can be used later in the columnResize event
      //   this.iIndex = oParent.indexOfItem(oItem);
      // },
      createColumnConfig: function() {
        var aCols = [];
  
        aCols.push({
          label: 'Delivery No',
          property: 'VBELN',
          type: EdmType.String
        });
        aCols.push({
          label: 'Item No',
          property: 'POSNR',
          type: EdmType.String
        });
  
        aCols.push({
          label: 'Supplier',
          type: EdmType.String,
          property: ['KUNNR', 'NAME1'],
          type: EdmType.String,
          template: '{0}-{1}'
        });
        aCols.push({
          label:'Material',
          type:EdmType.String,
          property:'matnr'
        });
        aCols.push({
          label:'Batch',
          type:EdmType.String,
          property:'CHARG'
        });
        // aCols.push({
        //   label:'Location',
        //   type:EdmType.String,
        //   property:['ORT01','LAND1'],
        //   template:'{0}-{1}'
        // });
        // aCols.push({
        //   label:'Temperature',
        //   type:EdmType.String,
        //   property:'Temp',
        // });
        // aCols.push({
        //   label:'Date',
        //   type:EdmType.String,
        //   property:'date',
        // });
        // aCols.push({
        //   label:'Latitude',
        //   type:EdmType.String,
        //   property:'latitude',
        // });
        // aCols.push({
        //   label:'Longitude',
        //   type:EdmType.String,
        //   property:'longitude',
        // });
        // aCols.push({
        //   label:'Location',
        //   type:EdmType.String,
        //   property:'location',
        // });
        aCols.push({
          label:'Text',
          type:EdmType.String,
          wrapping:'sap.ui.core.Wrapping.Hard',
          property:['Device','Temp','date','latitude','longitude','location','batchno','light','battery','pressure','humidity','hu','Accelometer'],
          template:'Device No:{0} Temperature:{1}   Date:{2}   Latitude:{3}   Longitude:{4}   Location:{5}   Batch:{6}     Light:{7}    Battery:{8}   Pressure:{9}   Humidity:{10}   Handling Unit:{11}  Accelometer:{12}'
        });

  
        // aCols.push({
        //   property: 'Firstname',
        //   type: EdmType.String
        // });
  
        // aCols.push({
        //   property: 'Lastname',
        //   type: EdmType.String
        // });
  
        // aCols.push({
        //   property: 'Birthdate',
        //   type: EdmType.Date
        // });
  
        // aCols.push({
        //   property: 'Salary',
        //   type: EdmType.Number,
        //   scale: 2,
        //   delimiter: true
        // });
  
        // aCols.push({
        //   property: 'Currency',
        //   type: EdmType.String
        // });
  
        // aCols.push({
        //   property: 'Active',
        //   type: EdmType.Boolean,
        //   trueValue: 'YES',
        //   falseValue: 'NO'
        // });
  
        return aCols;
      },
      onExportToExcel: function () {
        // Get the JSON data
        var rows = [];
    var selection = this.getView().byId('table').getItems();
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
    onExport: function() {
      var aCols, oRowBinding, oSettings, oSheet,delNo, oTable;
      var oModel = this.getView().getModel();
      debugger;
      if (!this._oTable) {
        this._oTable = this.byId('table');
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
        fileName: 'DeliveryTracker',
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
      createColumnConfig_n: function() {
        var aCols = [];
  
        aCols.push({
          label: 'Delivery No',
          property: ['VBELN', 'POSNR'],
          type: EdmType.String,
          template: '{0} {1}'
        });
  
        aCols.push({
          label: 'Supplier',
          type: EdmType.String,
          property: ['KUNNR', 'NAME1'],
          type: EdmType.String,
          template: '{0}-{1}'
        });
        
        aCols.push({
          label:'Text',
          type:EdmType.String,
          wrapping:'sap.ui.core.Wrapping.Hard',
          property:['Temp','date','latitude','longitude','location','batchno','status','light','orientation','battery','pressure','humidity','hu'],
          template:'Temperature:{0}   Date:{1}   Latitude:{2}   Longitude:{3}   Location:{4}   Batch:{5}   Status:{6}   Light:{7}   Orientation:{8}   Battery:{9}   Pressure:{10}   Humidity:{11}   HU:{12}'
        });
  
        return aCols;
      },
      onExit: function() {
        this._oMockServer.stop();
      }  
    });

  });