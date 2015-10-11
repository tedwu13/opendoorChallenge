var express = require('express');
var app = express();
var path = require('path');
var csvtoJson = require("csvtojson");
var DataStore = require("node-datastore");

// used the csvtojson package
var Converter = csvtoJson.Converter;

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/listings',  function (req, res) {
    //Create a new instance called openDoorConverter
    var opendoor_converter = new Converter({});

    // Set up api requirements for min/max prices, beds, and baths

    var minimum_price = req.query.min_price;
    var maximum_price = req.query.max_price;
    var minimum_bed = req.query.min_bed;
    var maximum_bed = req.query.max_bed;
    var minimum_bath = req.query.min_bath;
    var maximum_bath = req.query.max_bath;

    //End_parsed will be emitted once parsing finished 
    opendoor_converter.on("end_parsed", function (jsonObj) {

        var filteredArray = jsonObj.filter(function(obj) {

            if (minimum_price !== undefined && minimum_price > obj.price) {
                return false;
            }
            else if (maximum_price !== undefined && maximum_price < obj.price) {
                return false;
            }
            else if(minimum_bed !== undefined && minimum_bed > obj.bedrooms) {
                return false;
            }
            else if(maximum_bed !== undefined && maximum_bed < obj.bedrooms) {
                return false;   
            }
            else if(minimum_bath !== undefined&& minimum_bath > obj.bathrooms) {
                return false;       
            }
            else if(maximum_bath !== undefined && maximum_bath < obj.bathrooms) {
                return false;
            }
            else {
                return true;
            }
        });
        
        console.log("length of filteredArray", Object.keys(filteredArray).length);

        //Store the result with GeoJSON format
        var geo_json = { 
            "type": "FeatureCollection",
            "features": []
        }

        for (var i = 0; i < filteredArray.length; i++) {
            geo_json.features.push({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates":[filteredArray[i].lat, filteredArray[i].lng]},
                "properties": {
                    "id": filteredArray[i].id,
                    "price": filteredArray[i].price,
                    "street": filteredArray[i].street,
                    "bedrooms": filteredArray[i].bedrooms,
                    "bathrooms": filteredArray[i].bathrooms,
                    "sq_ft": filteredArray[i].sq_ft
                }
            });
        }


        res.send(geo_json);

        //use geoJSON store to store all the data of geo_json
        var geoJsonStore = new DataStore(geo_json, {pageSize: 20});

    });
 
    //read from file 
    require("fs").createReadStream("./listings.csv").pipe(opendoor_converter);

});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is listening at http://%s:%s', host, port);

});








