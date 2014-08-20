var logfmt = require('logfmt');
var log = logfmt.log.bind(logfmt);
var cpus = require('os').cpus().length;
var http = require('http');

var concurrent = require('./concurrent');
var config = require('./config');
var app = require('./app');
var web = require('./web');

if (!module.parent) {
  concurrent(createServer, config.concurrent ? cpus : 1);

  function createServer() {
    var instance = web(app(config), config);
    var server = http.createServer(instance);
    server.listen(config.port, onListen);

    function onListen() {
      log({ type: 'info', msg: 'listening', port: server.address().port });
    }
  }
}
