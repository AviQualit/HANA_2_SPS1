/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");
var request = require("request");
var https = require("https");
var xsenv = require("@sap/xsenv");
var moment = require("moment");
var async = require("async");
module.exports = function() {
	var app = express.Router();
	//Simple Database Select - Async Waterfall
	app.get("/example2", function(req, res) {
		var client = req.db;
	
		async.waterfall([
	
			function prepare(callback) {
				client.prepare("INSERT INTO \"A\" VALUES(?)",
					function(err, statement) {
						callback(null, err, statement);
					});
					
			},

			function execute(err, statement, callback) {
				statement.exec([["222"],["223"],["224"]], function(execErr, results) {
					callback(null, execErr, results);
				});
			},
			function response(err, results, callback) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				} else {
					var result = JSON.stringify({
						Objects: results
					});
					res.type("application/json").status(200).send(result);
				}
				callback();
			}
		]);
	});
	//insert soy
		//Simple Database Select - Async Waterfall
	app.get("/insert/soy", function(req, res) {
		var client = req.db;
	
		async.waterfall([
			function readFromQuandl(callback){
				var agentOptions;
var agent;

agentOptions = {
  host: "www.quandl.com"
, port: 443
, path: "/api/v3/datasets/CHRIS/CME_S1.json?api_key=mGgYFKrrUxPzZhP7euDi&start_date=2017-07-01"
, rejectUnauthorized: false
};

agent = new https.Agent(agentOptions);

request({
  url: "https://www.quandl.com/api/v3/datasets/CHRIS/CME_S1.json?api_key=mGgYFKrrUxPzZhP7euDi&start_date=2017-07-01"
, method: "GET"
, agent: agent
}, function(error, response, body)  {
			if (!error && response.statusCode == 200){
			console.log("OK STATUSSSSSSSSSSSSSSSSSSS");
			var obj = JSON.parse(body);
			
			callback(null,obj.dataset.data);
			}
			else {
				console.log(error.toString());
				callback(error);
			}
		});
			},
			function prepare(body,callback) {
				var arr = [];
				arr = body;
			
				for (var i=0; i<arr.length; i++){
				var d = moment(arr[i][0], 'YYYY-MM-DD');
				arr[i][0] = d.format('YYYY-MM-DD');
				arr[i].unshift("Soy");
				}
				client.prepare("INSERT INTO \"HANA2_1\".\"HANA_2_SPS1.db.data::soy\" VALUES(?,?,?,?,?,?,?,?,?,?)",
					function(err, statement) {
						callback(null, err,arr, statement);
					});
					
			},

			function execute(err, body,statement, callback) {
				statement.exec(body, function(execErr, results) {
					callback(null, execErr, results);
				});
			},
			function response(err, results, callback) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				} else {
					var result = JSON.stringify({
						Objects: results
					});
					res.type("application/json").status(200).send(result);
				}
				callback();
			}
		]);
	});

	//insert corn Database Select - Async Waterfall
	app.get("/quandl", function(req, res) {
		var client = req.db;
	
		async.waterfall([
			function readFromQuandl(callback){
				var agentOptions;
var agent;

agentOptions = {
  host: "www.quandl.com"
, port: 443
, path: "/api/v3/datasets/CHRIS/CME_C1.json?api_key=mGgYFKrrUxPzZhP7euDi&start_date=2018-03-01&end_date=2018-07-01"
, rejectUnauthorized: false
};

agent = new https.Agent(agentOptions);

request({
  url: "https://www.quandl.com/api/v3/datasets/CHRIS/CME_C1.json?api_key=mGgYFKrrUxPzZhP7euDi&start_date=2018-03-01&end_date=2018-07-01"
, method: "GET"
, agent: agent
}, function(error, response, body)  {
			if (!error && response.statusCode == 200){
			console.log("OK STATUSSSSSSSSSSSSSSSSSSS");
			var obj = JSON.parse(body);
			
			callback(null,obj.dataset.data);
			}
			else {
				console.log(error.toString());
				callback(error);
			}
		});
			},
			function prepare(body,callback) {
				var arr = [];
				arr = body;
			
				for (var i=0; i<arr.length; i++){
				var d = moment(arr[i][0], 'YYYY-MM-DD');
				arr[i][0] = d.format('YYYY-MM-DD');
				arr[i].unshift("Corn");
				}
				client.prepare("INSERT INTO \"HANA2_1\".\"HANA_2_SPS1.db.data::corn\" VALUES(?,?,?,?,?,?,?,?,?,?)",
					function(err, statement) {
						callback(null, err,arr, statement);
					});
					
			},

			function execute(err, body,statement, callback) {
				statement.exec(body, function(execErr, results) {
					callback(null, execErr, results);
				});
			},
			function response(err, results, callback) {
				if (err) {
					res.type("text/plain").status(500).send("ERROR: " + err.toString());
					return;
				} else {
					var result = JSON.stringify({
						Objects: results
					});
					res.type("application/json").status(200).send(result);
				}
				callback();
			}
		]);
	});


	//Hello Router
	app.get("/", function(req, res) {
		var agentOptions;
var agent;

agentOptions = {
  host: "www.quandl.com"
, port: 443
, path: "/api/v3/datasets/WIKI/FB.json?column_index=4&start_date=2017-01-01&end_date=2017-12-31&collapse=daily&transform=rdiff&api_key=mGgYFKrrUxPzZhP7euDi"
, rejectUnauthorized: false
};

agent = new https.Agent(agentOptions);

request({
  url: "https://www.quandl.com/api/v3/datasets/WIKI/FB.json?column_index=4&start_date=2017-01-01&end_date=2017-12-31&collapse=daily&transform=rdiff&api_key=mGgYFKrrUxPzZhP7euDi"
, method: "GET"
, agent: agent
}, function(error, response, body)  {
			if (!error && response.statusCode == 200){
			console.log("OK STATUSSSSSSSSSSSSSSSSSSS");
			res.send(body);
			}
			else {
				console.log(error.toString());
				res.send("errrrr Hello World Node.js");
			}
		});
		
		
	});
	//Simple Database Select - In-line Callbacks
//get corn handler
app.get("/example1", function(req, res) {
var client = req.db;
client.prepare(
	"SELECT * FROM \"HANA2_1\".\"HANA_2_SPS1.db.data::corn\";" ,
	function(err, statement) {
		if (err) {			
			res.type("text/plain").status(500).send("ERROR: " + err.toString());	return;	}
	statement.exec([],
		function(err, results) {
			if (err) {			
				res.type("text/plain").status(500).send("ERROR: " + err.toString());	return;						

		} else {							
			var result = JSON.stringify({ Objects: results});					
			res.type("application/json").status(200).send(result);
		}
		});
	});
});
//get corn handler
app.get("/select/soy", function(req, res) {
var client = req.db;
client.prepare(
	"SELECT * FROM \"HANA2_1\".\"HANA_2_SPS1.db.data::soy\";" ,
	function(err, statement) {
		if (err) {			
			res.type("text/plain").status(500).send("ERROR: " + err.toString());	return;	}
	statement.exec([],
		function(err, results) {
			if (err) {			
				res.type("text/plain").status(500).send("ERROR: " + err.toString());	return;						

		} else {							
			var result = JSON.stringify({ Objects: results});					
			res.type("application/json").status(200).send(result);
		}
		});
	});
});
	return app;
};

