function conf() {
  dnode(function (remote, conn) {
    conn.on('connect', function (){
        console.log("connection");
    });
    conn.on('ready', function () {
        // Request mac address of client
        remote.getMac(function(mac_address){
            // Save client
            console.log("connection:" + conn.id + "/" + mac_address);
            clients[mac_address] = remote;
            sockets[conn.id] = mac_address;
        });
    });
    conn.on('end', function(){
        mac_address = sockets[conn.id];
        console.log("disconnection:" + conn.id + "/" + mac_address);
    });
  }).listen(5000);
}
module.exports.conf = conf;
