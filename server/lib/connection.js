function conf() {
  upnode(function (remote, conn) {
    conn.on('connect', function (){
        console.log("connection");
    });

    // Connection starts
    conn.on('ready', function () {
        // Request MAC address of client and save in DB
        remote.getMac(function(mac){
            db.multi([
               ["set", "mac:" + mac, conn.id],
               ["set", "socket:" + conn.id, mac],
               ["sadd", "clients", mac],
               ["sadd", "connected", mac],
            ]).exec(function (err, replies) {
               if(err){
                  console.log("error:" + err.message);
               } else {
                  console.log("connection:" + conn.id + "/" + mac);
               }
            });
            clients[mac] = remote;
        });
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

  }).listen(80);
}
module.exports.conf = conf;
