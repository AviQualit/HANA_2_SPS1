sap.ui.define([
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(jQuery, MessageToast, Controller, JSONModel) {
	"use strict";

	return Controller.extend("quandlApp.controller.App", {
		onInit: function() {
		
			var view = this.getView();
			var myController = this;
			$.ajax({
				type: 'get',
				url: '/node/example1',
				success: function(data) {
					//build model
					var oModel = new JSONModel(data.Objects);
					//bind model to table
					view.byId("productTable").setModel(oModel);
					view.byId("productTable").bindRows("/");
					var dates = data.Objects.map(function(value) {
						return value._DATE;
					});
					var highValues = data.Objects.map(function(value) {
						return value._LAST;
					});
					var lineChartData = {
						labels: dates,
						datasets: [{
							label: "_LAST",
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
					myController.setTheLatestDataLabels("Corn",myController,view.byId("productChart").getModel("temp").oData.lineChart.datasets[0].label);
				}
			});
		},
		onDatasetSelected: function(dataset, controller) {
			var view = controller.getView();
			var myController = controller;
			var DataSetKey = dataset[0];
			var url = "";

			switch (DataSetKey) {
				case "Corn":
					url = "/node/example1";
					break;
				case "Soy":
					url = "/node/select/soy";
					break;
				default:
					url = "/node/example1";
			}

			$.ajax({
				type: 'get',
				url: url,
				success: function(data) {
					//build model
					//bind model to table
					view.byId("productTable").getModel().setData(data.Objects);
					view.byId("productTable").getModel().refresh();
					
					//find current key figure
					var currKeyFigue = view.byId("productChart").getModel("temp").oData.lineChart.datasets[0].label;
					//bind the model to chart by using key figure select function
					myController.onKeyFigureSelect(currKeyFigue,myController);
					
					//bind the model to text 
					myController.setTheLatestDataLabels(DataSetKey,myController, currKeyFigue);
					
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
							label: keyFigure,
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
			//myController.setTheLatestDataLabels(myController, keyFigure);
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
		setTheLatestDataLabels: function(dataSetName,myController, newMeasure ){
			var view = myController.getView();
			var lineValues = view.byId("productTable").getModel().oData;
			var sortedvalues  = myController.copyAndSortJsonArray(lineValues);
			view.byId("labelCurrentValue").setText("new current value");
			view.byId("commodityTextId").setText(dataSetName);
			view.byId("lastDate").setText("Database is up to: "+sortedvalues[0]["_DATE"]);
			//get the selected measure from chart
			var selectedMeasure;
			if (newMeasure === null){
			 selectedMeasure = view.byId("productChart").getModel("temp").oData.lineChart.datasets[0].label;
			}
			 else {
			 selectedMeasure = newMeasure;
			 }
			var currentValue = sortedvalues[0][selectedMeasure];
				view.byId("labelCurrentValue").setText(currentValue.toString());
			var previousValue = sortedvalues[1][selectedMeasure];
			var difference = currentValue - previousValue;
			view.byId("changeFromPreviousValue").setText(difference.toString());
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
				var measures = [{"id":"_LAST","text":"Last"},{"id":"_OPEN","text":"Open"},{"id":"_HIGH","text":"High"},{"id":"_LOW","text":"Low"},{"id":"_CHANGE","text":"Change"},{"id":"_SETTLE","text":"Settle"},{"id":"_VOLUME","text":"Volume"},{"id":"_PREVIOS","text":"Previous"}];
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
				var commodities = [{"id":"Corn","text":"Corn"},{"id":"Soy","text":"Soy"}];
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