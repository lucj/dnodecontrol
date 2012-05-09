function route(app){
  // Error 404 if no routes found
  app.get('*', function(req, res){
    res.writeHead(404, {'content-type': 'application/json'});
    res.write(JSON.stringify({"code": 404}));
    res.end();
  });

  app.post('*', function(req, res){
    res.writeHead(404, {'content-type': 'application/json'});
    res.write(JSON.stringify({"code": 404}));
    res.end();
  });

  app.put('*', function(req, res){
    res.writeHead(404, {'content-type': 'application/json'});
    res.write(JSON.stringify({"code": 404}));
    res.end();
  });

  app.delete('*', function(req, res){
    res.writeHead(404, {'content-type': 'application/json'});
    res.write(JSON.stringify({"code": 404}));
    res.end();
  });
}

module.exports.route = route;
