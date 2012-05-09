function conf(app, express){
  app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
  });

  app.configure('development', function(){
    // app.use(express.errorHandler({ dumpExceptions: false, showStack: false }));
  });

  app.configure('production', function(){
    // app.use(express.errorHandler());
  });
}

module.exports.conf = conf;

