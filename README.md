Server / Client bidirectional communication using dnode npm.  
Server and client run with node.js version 0.8.x  

- Server installation  
  
  cd server  
  npm install  
  node server.js  

server uses 2 differents ports:
  * WEB_SERVER_PORT: port on which web client can use the API (9000 by default)
  * CONNECTION_SERVER_PORT: port on which node client should connect (8000 by default)
  
- Client installation  
  
  cd client  
  npm install  
  node client.js SERVER:CONNECTION_SERVER_PORT
