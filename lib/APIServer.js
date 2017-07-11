// API server for PTransportes

var express = require('express');
var app = express();
var metro = require('./metro/metro');
var ferry = require('./ferry/ferry');

// define routes
app.get('/', function(req, res)
{
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ status: 1, description: 'PTransportes API Server' }));
});

app.get('/metro/:city', function(req, res)
{
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        city: req.params.city,
        lines: metro.getLineStatus(req.params.city)
    }));
});

app.get('/ferry/:city', function(req, res)
{
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        city: req.params.city,
        ferries: ferry.getFerryStatus(req.params.city)
    }));
});

// export the init method
module.exports.initAPIWebServer = function(port) 
{
    app.listen(port, function()
    {
        console.log('API web server enabled!');
    });
}