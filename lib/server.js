var logger = require('logfmt');
var cpus = require('os').cpus().length;
var http = require('http');

var concurrent = require('./concurrent');
var config = require('./config');
var app = require('./app');
var web = require('./web');

concurrent(config.concurrent ? cpus : 1, start);

function start(worker) {
  var instance = web(app(config), config);
  var server = http.createServer(instance);
  server.listen(config.port, onListen);

  function onListen() {
    logger.log({ type: 'info', msg: 'listening', port: server.address().port });
  }
}