var express = require("express");
var app = express();

// array of json objects to simulate a database as this simple API does not connect to a database.
var database = [ { price: 240000, city: "baltimore" }, 
    { price: 300000, city: "austin" }, 
    { price: 400000, city: "austin" }, 
    { price: 1000000, city: "seattle"}, 
    { price: 1325000, city: "baltimore" }, 
    { price: 550000, city: "seattle" }, 
    { price: 250000, city: "boston" } ];

// checking that the correct number of arguments were passed into the command line to start the API
if(process.argv.length < 3){
    console.log("Please enter the command with a port option");
}
else if(process.argv.length > 3) {
    console.log("Please enter only the port number as extra parameter.");
}
else {
    var port = process.argv[2];
    app.listen(port);
    console.log("Please navigate to localhost:" + port);
}

// Ouput message on how to use the API
app.get('/', function(req, res){
    res.write("Welcome to the zestimate API. Here are the endpoint options available to you: \n");
    res.write("/v1/zillow/zestimate needs 3 inputs of sqft, bed, and bath to calculate the zestimate.\n");
    res.write("/v1/zillow/houses needs 1 input of city to not send an empty array.\n");
    res.write("/v1/zillow/prices needs 1 input of usd to return results.")
    res.end();
})

// endpoint: /v1/zillow/zestimate needs 3 inputs of sqft, bed, and bath to calculate the zestimate.
app.get('/v1/zillow/zestimate', function(req, res){
    if(!req.query.sqft || !req.query.bed || !req.query.bath){
        res.status(404).send("Arguments missing for this endpoint");
    }
    var amount = req.query.sqft * req.query.bed * req.query.bath;
    var zestimate = {zestimate: amount};

    res.status(200).send(zestimate);
});

// /v1/zillow/houses has 1 optional parameter city returns empty if no parameter
app.get('/v1/zillow/houses', function(req, res){
    var filteredHouses = [];
    if(!req.query.city){
        res.status(404).send(filteredHouses);
    }
    filteredHouses = database.filter(house => house.city == req.query.city);

    res.status(200).send(filteredHouses);
});

// /v1/zillow/prices needs 1 parameter usd to filter list
app.get('/v1/zillow/prices', function(req, res){
    if(!req.query.usd){
        res.status(404).send("Missing usd argument for this endpoint.")
    }
    var filteredHouses = [];

    filteredHouses = database.filter(house => house.price <= req.query.usd);

    res.status(200).send(filteredHouses);
});