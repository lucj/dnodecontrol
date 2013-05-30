var upnode = require('upnode');
var exec = require('child_process').exec;
var macaddr = require('./lib/macaddr');

// Make sure server is provided
if(process.argv.length < 3){
    console.log("Client must be ran using:");
    console.log("node client.js SERVER:PORT");
    process.exit(1);
}

// Get server/port
var server = process.argv[2].split(':')[0];
var port = process.argv[2].split(':')[1];

// Get location of plugwise drivers
var user=process.env.USER
var plugwise="/home/" + user + "/dnodecontrol/client/zygbee"

// Helpers
require('./lib/helpers.js');

// Define client functions
upnode(function (remote, conn) {
    // Ping
    this.ping = function (cb) {
        cb("pong");
    };

    // Get mac address
    this.getMac = function(cb){
        macaddr.address(function(err, addr) {
            if (addr) {
                console.log('MAC address: ' + addr);
             } else {
                console.log('mac not found');
             }
             cb(addr);
        });
    };

    // Switch on device
    this.switchOnOff = function(id, action, cb){
        var cmd = "o";
        if(action == "off"){cmd = "f";}

        // Call plugwise driver
        child = exec('python ' + plugwise + '/pol.py -p /dev/ttyUSB0 -' + cmd + ' 000D6F0000' + id,
           function (error, stdout, stderr) {
             if(!error){
               cb({"status": action});
             } else {
               cb({"error": error});
             }
           }
        ); 
    };

    // Get device consumption
    this.consumption = function(id, cb){
        // Call Plugwise driver
        child = exec('python ' + plugwise + '/pol.py -p /dev/ttyUSB0 -w 000D6F0000' + id,
           function (error, stdout, stderr) {
             if(!error){
               cb({"consumption": stdout.chomp()});
             } else {
               cb({"error": error});
             }
           }
        ); 
    };

}).connect(server, port);
