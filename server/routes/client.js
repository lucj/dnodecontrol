function route(app, md, h){
  
  // Get list of connected clients (socket id)
  app.get('/clients', function(req, res){
     db.smembers("clients", function(err, clients){
        if(err){
           console.log("error:" + err.message);
           h.respond(res, { 'error' : err.message });
        } else {
           console.log("clients:" + clients);
           h.respond(res, clients);
        }
     });
  });

  // Check if client is connected
  app.get('/clients/:mac', md.checkConnection, function(req, res){
    var client = clients[req.params.mac];
    client.ping(function(msg){
       h.respond(res, { 'message': msg });
    });
  });

  // Get client's devices
  app.get('/clients/:mac/devices', md.checkConnection, function(req, res){
     db.smembers("mac:" + req.params.mac + ":devices", function(err, devices){
        if(err){
           console.log("error:" + err.message);
           h.respond(res, { 'error' : err.message });
        } else {
           console.log("devices:" + devices);
           h.respond(res, devices);
        }
     });
  });

  // Add device to client
  app.post('/clients/:mac/devices', md.checkParams(["id"]), md.checkConnection, function(req, res){
     var device_id = req.query["id"];
     var mac = req.params.mac;
     db.sadd("mac:" + mac + ":devices", device_id, function(err, obj){
        if(err){
           console.log("error:" + err.message);
           h.respond(res, { 'error' : err.message });
        } else {
           console.log("device " + device_id + " added");
           h.respond(res, {"status": "ok"});
        }
     });
  }); 

  // Delete device from client
  app.delete('/clients/:mac/devices', md.checkParams(["id"]), md.checkConnection, function(req, res){
     var device_id = req.query["id"];
     var mac = req.params.mac;
     db.srem("mac:" + mac + ":devices", device_id, function(err, obj){
        if(err){
           console.log("error:" + err.message);
           h.respond(res, { 'error' : err.message });
        } else {
           console.log("device " + device_id + " removed");
           h.respond(res, {"status": "ok"});
        }
     });
  }); 

  // Switch on/off a device
  // app.put('/clients/:mac/devices/:id', md.checkOnOffAction, md.checkConnection, md.checkDeviceOwnership, function(req, res){
  app.get('/clients/:mac/devices/:id/:action', md.checkConnection, md.checkDeviceOwnership, function(req, res){
    // Get client
    var client = clients[req.params.mac];

    // Get id  of the device to switch on
    var id = req.params.id;

    // Get action
    // var action = req.query["action"];
    var action = req.params.action;

    // Call action on client
    client.switchOnOff(id, action, function(msg){
       console.log(msg);
       h.respond(res, {"result": msg});
    });
  });

  // Get device consumption
  app.get('/clients/:mac/devices/:id', md.checkConnection, md.checkDeviceOwnership, function(req, res){
    // Get client
    var client = clients[req.params.mac];

    // Get id  of the device
    var id = req.params.id;

    // Call action on client
    client.consumption(id, function(msg){
       console.log(msg);
       h.respond(res, {"result": msg});
    });
  });

}  

module.exports.route = route;
