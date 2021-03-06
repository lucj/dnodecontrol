upnode = require('upnode');
util = require('util');
express = require('express');
exec = require('child_process').exec;
redis = require('redis');

// Hashes to keep track of clients (mac address and sockets)
clients = {}; 

// App configuration
// var app = express.createServer();
var app = express();
require('./config/environments.js').conf(app, express);

// Database configuration
require('./lib/db.js').db_connect(redis);

// Helpers
helpers = require('./lib/helpers.js');

// Middelware
middleware = require('./lib/middleware.js');

// Handling of incoming connection
require('./lib/connection.js').conf();

// Routes
require('./routes/client.js').route(app, middleware, helpers);
require('./routes/404.js').route(app);

// Run server
var web_server_port = process.env.WEB_SERVER_PORT || 9000;
app.listen(web_server_port);
console.log("- web client can connect on port: " + web_server_port);
