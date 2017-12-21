"use strict";
//Require modules
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

//Require controllers
const index = require('./routes/_');
const beers = require('./routes/beers');

//Require tools
const config = require('./config');
const socket = require('./tools/socket');

//FUNCTION normalizePort
//@param val port to normalize
let normalizePort = (val) => {
  let port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//FUNCTION onError
//@param error error to log
let onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//FUNCTION onListening
//@param server server to show port listening
let onListening = (server) => {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger('Listening on ' + bind);
  return 'Listening on ' + bind;
};

let app = express();
let port = normalizePort(config.port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//allow CORS
app.use(cors());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Set up logger
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Load Models
require('./models').load(app, {useMongoClient: true});

//Set up controllers to routes
app.use('/', index);
app.use('/beers', beers);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send(res.locals);
});

app.set('port', port);

//Create HTTP server

let server = http.createServer(app);
socket.setApp(server);

//Listen on provided port, on all network interfaces.

server.listen(port);
server.on('error', onError);
server.on('listening', () => onListening(server));

module.exports = server;