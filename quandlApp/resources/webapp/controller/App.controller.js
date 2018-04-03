sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(jQuery, Controller, JSONModel) {
	"use strict";

	return Controller.extend("quandlApp.controller.App", {
		onInit: function() {
			var view = this.getView();
			$.ajax({
				type: 'get',
				url: '/node/example1',
				success: function(data) {
				//build model
				var oModel = new JSONModel(data.Objects);
				//bind model to table
					view.byId("cornTable").setModel(oModel);
					view.byId("cornTable").bindRows("/");
				}
			});
		},
		getSoy: function (oEvent) {
				var view = this.getView();
			$.ajax({
				type: 'get',
				url: '/node/select/soy',
				success: function(data) {
				//build model
				//bind model to table
					view.byId("cornTable").getModel().setData(data.Objects);
					view.byId("cornTable").getModel().refresh();
				}
			});
		},
		getCorn: function (oEvent) {
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
		}
	});
});