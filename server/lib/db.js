function db_connect(redis) {
  db = redis.createClient('6379', 'localhost');

  db.on("ready", function(err){
    console.log("- ready to handle database client");
  });

  db.on("connect", function(err){
    console.log("- connected to the redis database");
  });

  db.on("error", function (err) {
    console.log("Error " + err);
  });

  // Empty current sockets
  db.multi([
     ["del", "clients"],
     ["del", "connected"],
  ]).exec(function (err, replies) {
     if(err){
        console.log("error:" + err.message);
        process.exit(1);
     }
  });
}

module.exports.db_connect = db_connect;
