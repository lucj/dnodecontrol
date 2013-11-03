var upnode  = require('upnode');
var nconf   = require('nconf');
var exec    = require('child_process').exec;
var macaddr = require('./lib/macaddr');

// Reads configuration file
nconf.file('./config.json');

// Get server/port
var server = nconf.get('server:host');
var port = nconf.get('server:port');

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

    // Get mac address and devices attached
    this.getMacAndDevices = function(cb){
        macaddr.address(function(err, addr) {
            if (addr) {
                console.log('MAC address: ' + addr);
             } else {
                console.log('mac not found');
             }

             // Read devices from configuration file
             // devices = ['123', '456'];
             var devices = nconf.get('devices').split(',');
             cb(addr, devices);
        });
    };

    // Switch on device
    this.switchOnOff = function(id, action, cb){
        var cmd = "o";
        if(action == "off"){cmd = "f";}

        // Call plugwise driver
        child = exec('python ' + plugwise + '/pol.py -p ' + nconf.get('plugwise') + ' -' + cmd + ' 000D6F0000' + id,
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
        child = exec('python ' + plugwise + '/pol.py -p ' + nconf.get('plugwise') + ' -w 000D6F0000' + id,
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
