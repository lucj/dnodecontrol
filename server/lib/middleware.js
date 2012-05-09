(function(){

  function error(res, err){
    res.writeHead(500, {'content-type': 'application/json'});
    res.write(JSON.stringify(err));
    res.end();
  }

  function checkParams(arr){
    return function(req, res, next) {
      // Make sure each param listed in arr is present in req.query
      var missing_params = [];
      for(var i=0;i<arr.length;i++){
        if((! eval("req.query." + arr[i])) && (! eval("req.params." + arr[i]))){
          missing_params.push(arr[i]);
        }
      }
      if(missing_params.length == 0){
        next();
      } else {
        error(res, { "error" : "query error", "message" : "Parameter(s) missing: " + missing_params.join(",") });
      } 
    }
  }

  // Get current socket from MAC address
  function checkConnection(req, res, next){
    var mac_address = req.params.mac;
    if(clients[mac_address] == undefined){
        error(res, { "error" : "error", "message" : "device " + mac_address + " not connected"});
    } else {
        next();
    }
  }

  // Ckeck if action provided is ON or OFF
  function checkOnOffAction(req, res, next){
      var action = req.query["action"];
      if((action == "on") || (action == "ON") || (action == "OFF") || (action == "off")){
          next();
      } else {
          error(res, { "error" : "Action must be ON or OFF"});
      }
  }

  // If device provided, make sure it's associated to the MAC address
  function checkDeviceOwnership(req, res, next){
     var mac_address = req.params.mac;
     var device_id = req.query["device_id"];
     if(device_id == undefined){
        next();
     } else {
       db.smembers("mac:" + mac_address + ":devices", function(err, devices){
          if(err){
             error(res, {"error": "database error", "message": err.message});
          } else {
             if(devices){
                // Check if device_id is among the devices retrieved
                var found = 0;
                for (var i = 0; i < devices.length; i++) {
                   if (devices[i] == device_id) {
                      found = 1;
                   }
                } 
                if(found == 1){
                   next();
                } else {
                   error(res, {"error": "Device " + device_id + " does not belong to " + mac_address});
                }
             } else {
                next();
             }
          }
       });
     }
  }

  module.exports.checkParams   		= checkParams;
  module.exports.checkConnection	= checkConnection;
  module.exports.checkOnOffAction	= checkOnOffAction;
  module.exports.checkDeviceOwnership   = checkDeviceOwnership;
}());
