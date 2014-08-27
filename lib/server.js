var logger = require('logfmt');
var cpus = require('os').cpus().length;
var http = require('http');

var throng = require('./throng');
var config = require('./config');
var app = require('./app');
var web = require('./web');

throng(config.concurrent ? cpus : 1, start);

function start() {
  var instance = app(config);
  var server = http.createServer(web(instance, config));

  if (config.thrifty) instance.startScraping();
  server.listen(config.port, onListen);

  function onListen() {
    logger.log({ type: 'info', msg: 'listening', port: server.address().port });
  }

  process.on('SIGTERM', function() {
    logger.log({ type: 'info', msg: 'shutting down' });
    server.close(function() {
      logger.log({ type: 'info', msg: 'exiting' });
      process.exit();
    });
  });
}
