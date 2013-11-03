Server / Client bidirectional communication using dnode npm.  
Server and client run with node.js version 0.6.x  

- Server installation  
  
  cd server  
  npm install  
  node server.js  
  
- Client installation  
  
  cd client  
  npm install  
  node client.js  
  
Troobleshooting:
- Redis installed in luc's home
- run server as luc
- run client with sudo /opt/node-0.8.22/bin/node dnode-client.js localhost:8000
- add device with curl -POST 'http://localhost:9000/clients/b8:27:eb:73:3c:bc/devices?id=98A5D4'
