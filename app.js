var express = require('express');
var app = express();
var fs = require("fs");


// NPM INSTALL CSVTOJSON Package
var Converter = require("csvtojson").Converter;
var converter = new Converter({});


//end_parsed will be emitted once parsing finished 
converter.on("end_parsed", function (jsonArray) {
   console.log(jsonArray); //here is your result jsonarray 
});
 
//read from file 
require("fs").createReadStream("./file.csv").pipe(converter);

// respond with "Hello World!" on the homepage
app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});








