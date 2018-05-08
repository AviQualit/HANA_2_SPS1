sap.ui.define([
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(jQuery, MessageToast, Controller, JSONModel) {
	"use strict";

	return Controller.extend("quandlApp.controller.App", {
		onInit: function() {
			var myController = this;
			var view = this.getView();
			var myController = this;
			$.ajax({
				type: 'get',
				url: '/node/select/product?productId=corn',
				success: function(data) {
					//build model
					myController.buildTable(myController,data);
					//var oModel = new JSONModel(data.Objects);
					//bind model to table
					//view.byId("productTable").setModel(oModel);
					//	view.byId("productTable").bindRows("/");
					var dates = data.Objects.map(function(value) {
						return value._DATE;
					});
					var highValues = data.Objects.map(function(value) {
						return value._SETTLE;
					});
					var lineChartData = {
						labels: dates,
						datasets: [{
							label: "SETTLE",
							fill: false,
							lineTension: 0.1,
							backgroundColor: "rgba(75,192,192,0.4)",
							borderColor: "rgba(75,192,192,1)",
							borderCapStyle: 'butt',
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointBorderColor: "rgba(75,192,192,1)",
							pointBackgroundColor: "#fff",
							pointBorderWidth: 1,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: "rgba(75,192,192,1)",
							pointHoverBorderColor: "rgba(220,220,220,1)",
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10,
							data: highValues,
							spanGaps: false
						}]
					};

					view.byId("productChart").setModel(new JSONModel({
						lineChart: lineChartData
					}), "temp");
					
					myController.setTheLatestDataLabels(myController,"_"+view.byId("productChart").getModel("temp").oData.lineChart.datasets[0].label);
				}
			});
		},
		onDatasetSelected: function(dataset, controller) {
			
			var view = controller.getView();
			//remove all coloumns from table  current table
			view.byId("productTable").removeAllColumns();
			var myController = controller;
			var DataSetKey = dataset[0];
			var url = "";
			//create http url with productId parameter
			url = "/node/select/product?productId="+DataSetKey.toLowerCase();

			$.ajax({
				type: 'get',
				url: url,
				success: function(data) {
					//build model
					//bind model to table
					//var productNameCustomData = new sap.ui.core.CustomData({key:DataSetKey});
				
					myController.buildTable(myController,data);
					//view.byId("productTable").refresh();
					//find current key figure
					var currKeyFigue = "_"+view.byId("productChart").getModel("temp").oData.lineChart.datasets[0].label.slice(0,view.byId("productChart").getModel("temp").oData.lineChart.datasets[0].label.length);
					//if key figure does not exists choose the first one from the table
					var currentKeyToCheck = currKeyFigue;
					var currModel = view.byId("productTable").getModel().oData[0];
					var containKeyFigure = false;
					
					//check if data set contains current key figure
						for (var key in currModel) {
    						if (currModel.hasOwnProperty(key)) {
        							var coloumnName = key.slice(0, key.length);
    							if(coloumnName.toString() === currentKeyToCheck.toString()){
    								containKeyFigure =true;
    								break;
    							}
    						}
						}
						//if data vase does not contian curren key figure select the first one from the list
						if(!containKeyFigure){
								for (var key in currModel) {
    						if (currModel.hasOwnProperty(key)) {
        							var coloumnName = key.slice(0, key.length);
    							if(coloumnName.toString() !=="_DATE" && coloumnName.toString() !=="_PRODUCT"){
    								 currKeyFigue = coloumnName;
    								break;
    							}
    						}
						}
						}
    							
					
					//bind the model to chart by using key figure select function
					myController.onKeyFigureSelect(currKeyFigue,myController);
				}
			});
			
		},
		getSoy: function(oEvent) {
			var view = this.getView();
			$.ajax({
				type: 'get',
				url: '/node/select/soy',
				success: function(data) {
					//build model
					//bind model to table
					view.byId("productTable").getModel().setData(data.Objects);
					view.byId("productTable").getModel().refresh();
				}
			});
		},
		buildTable: function(mycontroller, dataModel){
			var view = mycontroller.getView();
			var oTable = view.byId("productTable");
			//create coloumns by going over the keys of first data in the array
			for (var key in dataModel.Objects[0]) {
    	if (dataModel.Objects[0].hasOwnProperty(key)) {
        var coloumnName = key.slice(0, key.length);
        oTable.addColumn(new sap.ui.table.Column({
		label: new sap.m.Label({text: coloumnName}),
		template: new sap.m.Text({text: "{"+coloumnName+"}"}),
		/*template: new sap.ui.commons.Text().bindProperty("value", coloumnName),*/
		sortProperty: coloumnName,
		filterProperty: coloumnName
/*
oTable.addColumn(new sap.ui.table.Column({
    label: new sap.ui.commons.Label({text: "First Name"}), 
    template: new sap.ui.commons.TextField({value: "{name}"})
  }));
*/
  }));
    }
}				//bind to model
				var oModel = new JSONModel(dataModel.Objects);
					//bind model to table
					view.byId("productTable").setModel(oModel);
					view.byId("productTable").bindRows("/");
				
		},
		onKeyFigureSelect: function(keyFigure, controller) {
			var view = controller.getView();
			var myController = controller;
			
		
			var lineValues = view.byId("productTable").getModel().oData;
		
			var valuesArr = [];
								var dates = lineValues.map(function(value) {
						return value._DATE;
					});
			
					
				for (var i=0, iLen=lineValues.length; i<iLen; i++) {
					valuesArr.push(lineValues[i][keyFigure]);
				}
					var lineChartData = {
						labels: dates,
						datasets: [{
							label: keyFigure.toString().slice(1,keyFigure.lenth),
							fill: false,
							lineTension: 0.1,
							backgroundColor: "rgba(75,192,192,0.4)",
							borderColor: "rgba(75,192,192,1)",
							borderCapStyle: 'butt',
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointBorderColor: "rgba(75,192,192,1)",
							pointBackgroundColor: "#fff",
							pointBorderWidth: 1,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: "rgba(75,192,192,1)",
							pointHoverBorderColor: "rgba(220,220,220,1)",
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10,
							data: valuesArr,
							spanGaps: false
						}]
					};
		
			
					
				view.byId("productChart").setModel(new JSONModel({
						lineChart: lineChartData
					}), "temp");
		view.byId("productChart").getModel("temp").refresh();
			myController.setTheLatestDataLabels(myController, keyFigure);
	//	sap.ui.getCore().byId("productChart").rerender();

		},
		getCorn: function(oEvent) {
			var view = this.getView();
			$.ajax({
				type: 'get',
				url: '/node/example1',
				success: function(data) {
					//build model
					view.byId("cornTable").getModel().setData(data.Objects);
					view.byId("cornTable").getModel().refresh();
				}
			});
		},
		handleNav: function(evt) {
			var navCon = this.getView().byId("navCon");
			var target = evt.getSource().data("target");
			if (target) {
				var animation = "fade";
				navCon.to(this.getView().byId(target), animation);
			} else {
				navCon.back();
			}
		},
		copyAndSortJsonArray: function(arr){
			var newArr =[];
			for (var i=0; i<arr.length; i++){
				var current  = Object.assign({}, arr[i]);
				newArr.push(current);
			}
			newArr.sort(function(a, b) {
  // convert date object into number and sort decending
			return  +new Date(b._DATE) - +new Date(a._DATE);
			});
			return newArr;
		},
		setTheLatestDataLabels: function(myController, newMeasure ){
			var view = myController.getView();
			 var product = view.byId("productTable").getModel().oData[0]._PRODUCT.slice(0);
			var dataSetName =product.charAt(0).toUpperCase() + product.slice(1);
			var lineValues = view.byId("productTable").getModel().oData;
			var sortedvalues  = myController.copyAndSortJsonArray(lineValues);
			view.byId("labelCurrentValue").setText("new current value");
			view.byId("commodityTextId").setText(dataSetName);
		
			//get the selected measure from chart
			var selectedMeasure;
			if (newMeasure === null){
			 selectedMeasure = "_"+view.byId("productChart").getModel("temp").oData.lineChart.datasets[0].label;
			}
			 else {
			 selectedMeasure = newMeasure;
			 }
			 var currentValue = null;
			 var previousValue = null;
			 var currentValuelocation = 0;
			 //get the newest not null key figure
			 for (var i =0; i<sortedvalues.length; i++){
			 	//get first 
			 	if (currentValue === null ){
			 		if (sortedvalues[i][selectedMeasure] !== null){
			 			currentValue = sortedvalues[i][selectedMeasure];
			 			currentValuelocation = i;
			 			break;
			 		}
			 	}
			 	
			 }
			 //get the first not null previous value
			 	for (var j = currentValuelocation+1; j<sortedvalues.length; j++){
			 	//get first 
			 	if (previousValue === null ){
			 		if (sortedvalues[j][selectedMeasure] !== null){
			 			previousValue = sortedvalues[j][selectedMeasure];
			 			break;
			 		}
			 	}
			 	
			 }
			 	
			 
			view.byId("lastDate").setText("Measure last Update: "+sortedvalues[currentValuelocation]["_DATE"]);
				view.byId("labelCurrentValue").setText(currentValue.toString());
		
			var difference = currentValue - previousValue;
			view.byId("changeFromPreviousValue").setText(difference.toFixed(2).toString());
			//color red if smaller then 0
			if (difference < 0){
			
			view.byId("changeFromPreviousValue").removeStyleClass("valueLabelPositiveOption");
			view.byId("changeFromPreviousValue").addStyleClass("valueLabelNegativeOption");
			}
			//else color green
			else {
			view.byId("changeFromPreviousValue").removeStyleClass("valueLabelNegativeOption");
			view.byId("changeFromPreviousValue").addStyleClass("valueLabelPositiveOption");
			}
			var percent = (difference / previousValue * 100).toFixed(2);
			view.byId("changeFromPreviousPercent").setText(" ("+percent.toString()+"%)");
			if (percent < 0){
			
			view.byId("changeFromPreviousPercent").removeStyleClass("valueLabelPositiveOption");
			view.byId("changeFromPreviousPercent").addStyleClass("valueLabelNegativeOption");
			}
			//else color green
			else {
			view.byId("changeFromPreviousPercent").removeStyleClass("valueLabelNegativeOption");
			view.byId("changeFromPreviousPercent").addStyleClass("valueLabelPositiveOption");
			}
		
			
		},
		onExit : function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},
		handleSelectMeasureDialogPress: function(oEvent){
		if (this._oDialog) {
				this._oDialog.destroy();
				this._oDialog = undefined;
			}
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("quandlApp.view.MeasureSelect", this);
				//get measures from the the model
				var measures = [];
					
					//build measure list
					var measuresData  = this.getView().byId("productTable").getModel().oData[0];
						for (var key in measuresData) {
    						if (measuresData.hasOwnProperty(key)) {
        					var coloumnName = key.slice(0, key.length);
        						if (coloumnName!=="_DATE" && coloumnName!=="_PRODUCT"){
        							var currentMeasue = {"id":coloumnName, "text":coloumnName.slice(1,coloumnName.length) };
        							measures.push(currentMeasue);
        						}
        					
								
    						}
						}
					
				///var measures = [{"id":"_LAST","text":"Last"},{"id":"_OPEN","text":"Open"},{"id":"_HIGH","text":"High"},{"id":"_LOW","text":"Low"},{"id":"_CHANGE","text":"Change"},{"id":"_SETTLE","text":"Settle"},{"id":"_VOLUME","text":"Volume"},{"id":"_PREVIOS","text":"Previous"}];
				var listMeasures = new JSONModel(measures);
				this._oDialog.setModel(listMeasures);
				
			
			}
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);

			// clear the old search filter
			this._oDialog.getBinding("items").filter([]);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
			
		},
		handleCloseMeasureDialog: function(oEvent) {
					var myController = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				
			var measureKey = aContexts.map(function(oContext) { return oContext.getObject().id; });
			var measureText = aContexts.map(function(oContext) { return oContext.getObject().text; });
		
				myController.onKeyFigureSelect(measureKey,myController);
				MessageToast.show("You have chosen " + measureText);
			} else {
				MessageToast.show("No new item was selected.");
			}
			
		},
		handleSelectCommodityDialogPress: function (oEvent) {
			var dialog = this._oDialog;
				if (this._oDialog) {
				this._oDialog.destroy();
				this._oDialog = undefined;
			}
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("quandlApp.view.Dialog", this);
				var commodities = [{"id":"Corn","text":"Corn"},{"id":"Soy","text":"Soy"},{"id":"Sugar","text":"Sugar"},{"id":"Cotton","text":"Cotton"},{"id":"Wheat","text":"Wheat"},{"id":"Milk","text":"Milk"}];
				var listCommodities = new JSONModel(commodities);
				this._oDialog.setModel(listCommodities);
				
			
			}
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);

			// clear the old search filter
			this._oDialog.getBinding("items").filter([]);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		handleCloseCommodityDialog: function(oEvent) {
					var myController = this;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				
			var DataSetKey = aContexts.map(function(oContext) { return oContext.getObject().text; });
			myController.onDatasetSelected(DataSetKey,myController);

				MessageToast.show("You have chosen " + aContexts.map(function(oContext) { return oContext.getObject().text; }).join(", "));
			} else {
				MessageToast.show("No new item was selected.");
			}
			
		}
	});
});