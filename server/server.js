dnode = require('dnode');
util = require('util');
express = require('express');
exec = require('child_process').exec;
redis = require('redis');
hash = require('hashish');

// Hashes to keep track of clients (mac address and sockets)
clients = {}; 

// App configuration
var app = express.createServer();
require('./config/environments.js').conf(app, express);

// Database configuration
require('./lib/db.js').db_connect(redis);

// Helpers
helpers = require('./lib/helpers.js');

// Middelware
middleware = require('./lib/middleware.js');

// Handling of incoming connection
require('./lib/connection.js').conf(dnode);

// Routes
require('./routes/client.js').route(app, middleware, helpers);
require('./routes/404.js').route(app);

// Run server
app.listen(9000);
