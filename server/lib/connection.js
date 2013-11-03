function conf() {

  // Server port 
  var server_connection_port = process.env.SERVER_CONNECTION_PORT || 80;
  console.log("- client can connect on port: " + server_connection_port);

  upnode(function (remote, conn) {

    // Create connection unique identifier
    token = require('crypto').randomBytes(20).toString('base64');
    conn.id = token;

    conn.on('connect', function (){
        console.log("connection");
    });

    // Connection starts
    conn.on('ready', function () {

        // Request MAC address and devices of client and save in DB
        remote.getMacAndDevices(function(mac, devices){
            db.multi([
               ["set", "mac:" + mac, conn.id],
               ["set", "socket:" + conn.id, mac],
               ["sadd", "clients", mac],
               ["sadd", "connected", mac],
               ["sadd", "mac:" + mac + ":devices", devices]
            ]).exec(function (err, replies) {
               if(err){
                  console.log("error:" + err.message);
               } else {
                  console.log('[' + conn.id + ']/[' + mac + ']/[' + devices + ']');
               }
            });
            clients[mac] = remote;
        });

        // TOOD register client device !!!!
    });

    // Connection ends
    conn.on('end', function(){
        // Remove MAC address from DB
        db.get("socket:" + conn.id, function(err, mac){
           if(err){
              console.log("error:" + err.message);
           } else {
              db.multi([
                 ["del", "mac:" + mac],
                 ["del", "socket:" + conn.id],
                 ["srem", "clients", mac],
                 ["srem", "connected", mac],
                 ["del", "mac:" + mac + ":devices"]
              ]).exec(function(err, replies){
                 if(err){
                    console.log("error:" + er.message);
                 } else {
                    clients[mac] = undefined;
                    console.log("disconnection:" + conn.id + "/" + mac);
                 }
              });
           }
        });
    });

  }).listen(server_connection_port);
}
module.exports.conf = conf;
