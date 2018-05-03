"use strict";
var express = require("express");
var request = require("request");
var https = require("https");
var xsenv = require("@sap/xsenv");
var moment = require("moment");

//var async = require("async");

/*
 *	return max date from table in order to do delta update
 *	result format {maxDate: 01-01-2018}
 */
exports.getTopDateFromTable = function(client, tblName,callback) {
	

	client.prepare(
		"SELECT MAX (_DATE) as \"maxDate\" FROM " + tblName,
		function(err, statement) {
			if (err) {
				var error = {
					"error": err.toString()
				};
				callback(error);
			}
			statement.exec([],
				function(err, results) {
					if (err) {
						var error = {
							"error": err.toString()
						};
						callback(error);

					} else {
						var result = {
							"maxDate": results[0].maxDate
						};
						//console.log(result);
						callback(result,callback);
					}
				});

		});
};

/*
 *	return all values from table in JSON FORMAT
 */
exports.getAllValuesFromTable = function(client, tblName,callback) {

	client.prepare(
		"SELECT * FROM " + tblName,
		function(err, statement) {
			if (err) {
				var error = {
					"error": err.toString()
				};
			callback(error);
			}
			statement.exec([],
				function(err, results) {
					if (err) {
						var error = {
							"error": err.toString()
						};
							callback(error);

					} else {
						var myRes = results;
						var result = {
							Objects: results
						};
						//console.log(result);
						callback(result);
					}
				});
		});
};
/*
 *	insert to table. if date exists update record
 */
exports.insertToTable = function(client, product, tblName, valuesArr,callback) {

		var arr = [];
		arr = valuesArr;

		for (var i = 0; i < arr.length; i++) {
			var d = moment(arr[i][0], 'YYYY-MM-DD');
			arr[i][0] = d.format('YYYY-MM-DD');
			arr[i].unshift(product.toString());
		}
		client.prepare("UPSERT " + tblName + " VALUES(?,?,?,?,?,?,?,?,?,?) with primary key;",
			function(err, statement) {
				if (err) {
					var error = {
						"error": err.toString()
					};
					callback(error);
				}
				statement.exec(arr, function(err, results) {
					if (err) {
						var error = {
							"error": err.toString()
						};
					callback(error);

					} else {
						var result = {
							Objects: results
						};
						//console.log(result);
						callback(result);
					}
				});
			});
};

exports.getDataFromQuandl = function(quandlPath,callback){
	
var agentOptions;
var agent;

agentOptions = {
  host: "www.quandl.com"
, port: 443
, path: quandlPath //"/api/v3/datasets/CHRIS/CME_S1.json?api_key=mGgYFKrrUxPzZhP7euDi&start_date=2017-07-01"
, rejectUnauthorized: false
};

agent = new https.Agent(agentOptions);

request({
  url: "https://www.quandl.com"+quandlPath
, method: "GET"
, agent: agent
}, function(error, response, body)  {
			if (!error && response.statusCode == 200){
			console.log("OK STATUSSSSSSSSSSSSSSSSSSS");
			var obj = JSON.parse(body);
			
			callback(obj.dataset); //the data is in obj.dataset.data
			}
			else {
					var err = {"error" : error.toString()};
					callback(err);
			}
		});
};

