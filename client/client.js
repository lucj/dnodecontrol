var dnode = require('dnode');
var exec = require('child_process').exec;

// Make sure server is provided
if(process.argv.length < 3){
    console.log("Client must be ran using:");
    console.log("node client.js http://SERVER:PORT");
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
dnode(function (remote, conn) {

    // Ping
    this.ping = function (cb) {
        cb("pong");
    };

    // Get mac address
    this.getMac = function(cb){
      child = exec('/sbin/ifconfig | grep HW | awk \'{print $5}\'', function (error, stdout, stderr) {
          mac = stdout.chomp();
          cb(mac);
      });
    };

    // Switch on device
    this.switchOnOff = function(id, action, cb){
        var cmd = "o";
        if(action == "off"){cmd = "f";}

        // Call plugwise driver
        child = exec('python ' + plugwise + '/pol.py -p /dev/ttyUSB1 -' + cmd + ' 000D6F0000' + id,
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
        child = exec('python ' + plugwise + '/pol.py -p /dev/ttyUSB1 -w 000D6F0000' + id,
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
