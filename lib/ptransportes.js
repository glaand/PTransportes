const API_PORT = 8080;
const APIServer = require('./APIServer');
const Twitter = require('./twitter');

Twitter.run();
APIServer.initAPIWebServer(API_PORT);