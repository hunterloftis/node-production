var cpus = require('os').cpus().length;
var logger = require('logfmt');

var throng = require('./throng');
var config = require('./config');
var app = require('./app');

throng(config.concurrent ? cpus: 1, start);

function start() {
  app(config).startScraping();

  process.on('SIGTERM', function() {
    logger.log({ type: 'info', msg: 'exiting' });
    process.exit();
  });
}
