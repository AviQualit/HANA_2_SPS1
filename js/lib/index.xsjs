/*var https = require("http");
var url =
  "https://maps.googleapis.com/maps/api/geocode/json?address=Florence";
https.get(url, function(res) {
  res.setEncoding("utf8");
  var body = "";
  res.on("data", function(data) {
    body += data;
  });
  res.on("end", function() {
    body = JSON.parse(body);
    console.log(body.results[0].formatted_address);
  });
});
*/

var conn = $.hdb.getConnection();


var query = "SELECT * FROM \"A\"";
var rs = conn.executeQuery(query);

var body = "";

for(var i = 0; i < rs.length; i++){
body += rs[i]["TEST"];
}


$.response.setBody(body);
$.response.contentType = "application/vnd.ms-excel; charset=utf-16le";
$.response.headers.set("Content-Disposition",
  "attachment; filename=Excel.xls");
$.response.status = $.net.http.OK;