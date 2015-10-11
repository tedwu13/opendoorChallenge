var express = require('express');
var app = express();
var path = require('path');
var _ = require('underscore');

// used the csvtojson package
var Converter = require("csvtojson").Converter;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/listings',  function (req, res) {
    //Create a new instance called openDoorConverter
    var openDoorConverter = new Converter({});

    // Set up api requirements for min/max prices, beds, and baths

    var minimum_price = req.query.min_price;
    var maximum_price = req.query.max_price;
    var minimum_bed = req.query.min_bed;
    var maximum_bed = req.query.max_bed;
    var minimum_bath = req.query.min_bath;
    var maximum_bath = req.query.max_bath;

    //End_parsed will be emitted once parsing finished 
    openDoorConverter.on("end_parsed", function (jsonObj) {
        console.log("length of json obj", Object.keys(jsonObj).length);

        var filteredArray = jsonObj.filter(function(obj) {

            if (_.isUndefined(minimum_price) && minimum_price > obj.price) {
                return false;
            }
            else if (_.isUndefined(maximum_price) && maximum_price < obj.price) {
                return false;
            }
            else if(_.isUndefined(minimum_bed) && minimum_bed > obj.bedrooms) {
                return false;
            }
            else if(_.isUndefined(maximum_bed) && maximum_bed < obj.bedrooms) {
                return false;   
            }
            else if(_.isUndefined(minimum_bath) && minimum_bath > obj.bathrooms) {
                return false;       
            }
            else if(_.isUndefined(maximum_bath) && maximum_bath < obj.bathrooms) {
                return false;
            }
            else {
                return true;
            }
        });

        console.log("length of filtered array", Object.keys(filteredArray).length);
    });
 
    //read from file 
    require("fs").createReadStream("./listings.csv").pipe(openDoorConverter);

});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is listening at http://%s:%s', host, port);

});








