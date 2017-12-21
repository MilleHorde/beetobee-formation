"use strict";
const socket = require('socket.io');
let app = {};
let io = {};

//FUNCTION alertElse
//Emit all client one object updated, removed or added
let alertElse = (send, type, eventName) => {
  let toSend = {
    type: type,
    item: send
  };
  io.emit(eventName, toSend);
};

//FUNCTION setAPP
//Set the socket configuration
let setApp = (server) => {
  app = server;
  io = socket.listen(app);

  //Allow access origin
  io.origins('*:*');

  io.on('connection', (socket) => {
    console.log(`New Connection on socket server : ${socket.id}`)
  });
};

module.exports = {
  io: io,
  setApp,
  alertElse
};