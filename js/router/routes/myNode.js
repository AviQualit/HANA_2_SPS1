/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
"use strict";
var express = require("express");
var request = require("request");
var https = require("https");
var xsenv = require("@sap/xsenv");
var moment = require("moment");
var async = require("async");
var dataAccess = require("./dataAccess");
module.exports = function() {
//	console.log(xsenv.getServices());

	var app = express.Router();

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
//	console.log(dataAcees.getTopDateFromTable(req.db,"TABLE"));      
		console.log("example1 start");
var client = req.db;
client.prepare(
	"SELECT * FROM \"HANA2_1\".\"HANA_2_SPS1.db.data::corn\" ORDER BY \"_DATE\" ASC;" ,
	function(err, statement) {
		if (err) {			
			res.type("text/plain").status(500).send("ERROR: " + err.toString());	return;	}
	statement.exec([],
		function(err, results) {
			if (err) {			
				res.type("text/plain").status(500).send("ERROR: " + err.toString());	return;						

		} else {							
			var result = JSON.stringify({ Objects: results});					
			//console.log(result);
			res.type("application/json").status(200).send(result);
		}
		});
	});
});
//get corn handler
app.get("/select/soy", function(req, res) {
var client = req.db;
client.prepare(
	"SELECT * FROM \"HANA2_1\".\"HANA_2_SPS1.db.data::soy\" ORDER BY \"_DATE\" ASC;" ,
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
/////////////////////////////////////////////////////////////////////////////////////////
/*
*insert data into database 
*/
app.get("/insert/product", function(req, res) {
	///get product from rout parameter uses http header param productId which contains commodity name (soy, corn, wheat, etc)
	var product = [];
	if (req.query.productId !== undefined){
	product.push(req.query.productId);
		var client = req.db;
	
		async.waterfall([function dataforSelection(callback){
			 async.parallel([
           function getUrl(parallelCallback){
			//read url by product from url table
				client.prepare(
		"SELECT _URL FROM \"HANA_2_SPS1.db.data::quandleUrl\" where _PRODUCT=?",
		function(err, statement) {
			if (err) {
				var error = {
					"error": err.toString()
				};
				parallelCallback(error);
			}
			statement.exec(product,
				function(err, results) {
					if (err) {
						var error = {
							"error": err.toString()
						};
						parallelCallback(error);

					} else {
						var result = {
							"url": results[0]._URL
						};
						//console.log(result);
						parallelCallback(null,results[0]._URL);
					}
				});

		});
		},function getMaxDate(parallelCallback){
          client.prepare(
		"SELECT MAX (_DATE) as \"maxDate\" FROM \"HANA_2_SPS1.db.data::"+product[0]+"\"",
		function(err, statement) {
			if (err) {
				var error = {
					"error": err.toString()
				};
				parallelCallback(error);
			}
			statement.exec([],
				function(err, results) {
					if (err) {
						var error = {
							"error": err.toString()
						};
						parallelCallback(error);

					} else {
						var result = {
							"maxDate": results[0].maxDate
						};
						//console.log(result);
						if (results[0].maxDate===null ){
						parallelCallback(null,"2017-01-01");
						}
						else{
								parallelCallback(null,results[0].maxDate);
						}
					}
				});

		});
}
      ],function mainCBOfParallel(err,results){
        if(!err){
          //this will be done after tasks in async.parallel are finished.
          callback(null,results);
          //results[0]===>rows1
          //results[1]===>rows2
        }
      });
		}, 
		
			function readFromQuandl(pathResults,callback){
	
				var agentOptions;
				var agent;

agentOptions = {
  host: "www.quandl.com"
, port: 443
, path: pathResults[0]+"&start_date="+pathResults[1]
, rejectUnauthorized: false
};

agent = new https.Agent(agentOptions);

request({
  url: "https://www.quandl.com"+pathResults[0]+"&start_date="+pathResults[1]
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
				arr[i].unshift(product[0]);
				}
				var query="";
				if (product[0]==="milk"){
						query = "UPSERT \"HANA2_1\".\"HANA_2_SPS1.db.data::"+product[0]+"\" VALUES(?,?,?) with primary key;";
				}
				else if ((product[0]==="cotton" )|| product[0]==="sugar")
				{
					query = "UPSERT \"HANA2_1\".\"HANA_2_SPS1.db.data::"+product[0]+"\" VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?) with primary key;";
				}
				else{
					query = "UPSERT \"HANA2_1\".\"HANA_2_SPS1.db.data::"+product[0]+"\" VALUES(?,?,?,?,?,?,?,?,?,?) with primary key;";
				}
				client.prepare(query,
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
		]);}
		else{
				res.type("text/html").status(200).send("Missing Commodity Name");
		}
});







////////////////////////////////////////////////////////////////////////////////////////////

	app.get("/insert/wheat", function(req, res) {
		var client = req.db;
			/*
			async.waterfall([
    function(callback) {
        callback(null, 'one', 'two');
    },
    function(arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
});
			*/
			dataAccess.getTopDateFromTable.bind(client,"\"HANA2_1\".\"HANA_2_SPS1.db.data::wheat\";");
		async.waterfall([dataAccess.getTopDateFromTable,function getMaxDate(queryDate,callback){
			 var maxDate = queryDate;
			if(maxDate.hasOwnProperty("error")) {
				callback(maxDate.error);
			}
			else {
				//if has no date start the date from 2017-01-01
				var path = "";
				
				if (maxDate.maxDate === null){
					path = "/api/v3/datasets/CHRIS/CME_W1.json?api_key=mGgYFKrrUxPzZhP7euDi&start_date=2017-01-01";
				}
				else {
					
					var date = maxDate.maxDate; 				
					path = "/api/v3/datasets/CHRIS/CME_W1.json?api_key=mGgYFKrrUxPzZhP7euDi&start_date="+date;
				}
				//else get data from Json
				callback(null,path);
			}
		}, function(path,callback){  dataAccess.getDataFromQuandl(path,callback);},
			function readFromQuandl(quandlData,callback){
			
				if (quandlData.hasOwnProperty("error")) {
				callback(quandlData.error);
			}
			///client, product, tblName, valuesArr
			else {
				callback(null,client,"wheat","\"HANA2_1\".\"HANA_2_SPS1.db.data::wheat\";", quandlData.data);
			}
			},function(client, product, tblName, valuesArr,callback){ dataAccess.insertToTable(client, product, tblName, valuesArr,callback); },
			function insertToTable(insertResult,callback) {
				
						if (insertResult.hasOwnProperty("error")) {
							res.type("text/plain").status(500).send("ERROR: " + insertResult.error.toString());
					
						}
						else{
							var result = JSON.stringify({
						Objects: insertResult
						});
					res.type("application/json").status(200).send(result);
				}
				callback();
						}
		]);
	});

	return app;
};

