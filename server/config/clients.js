(function(){

   everyone.now.distributeMessage = function(message){ 
      everyone.now.receiveMessage("test", message); 
   }

   now.on('connect', function () {
      // Get ID of the connected client
      var client_id = this.user.clientId; 

      // Get the mac address of the client and save into db
      now.getClient(client_id, function (err) {
         this.now.receiveMessage({"action": "mac"}, function(mac){
            console.log("connection: " + client_id + "/" + mac);
            db.multi([
               ["set", "mac:" + mac, client_id],
               ["set", "socket:" + client_id, mac],
               ["sadd", "clients", mac],
               ["sadd", "connected", mac],
            ]).exec(function (err, replies) {
               if(err){
                  console.log("error:" + err.message);
               }
            });
         });
      });
   });

   now.on('disconnect', function () {
      // Get ID of the connected client
      var client_id = this.user.clientId; 

      // Get MAC address from socket id
      db.get("socket:" + client_id, function(err, mac){
         if(err){
            console.log("error:" + err.message);
         } else {
            console.log("disconnection: " + client_id + "/" + mac);
            // Remove connected client from list
            db.multi([
               ["del", "mac:" + mac],
               ["del", "socket:" + client_id],
               ["srem", "clients", mac],
               ["srem", "connected", mac],
            ]).exec(function(err, replies){
               if(err){
                  console.log("error:" + er.message);
               }
            });
         }
      });
   });

}());
