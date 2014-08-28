var logger = require('logfmt');
var throng = require('throng');

var config = require('./config');
var app = require('./app');

throng(start, { workers: config.concurrent ? null : 1 });

function start() {
  app(config).startScraping();

  process.on('SIGTERM', function() {
    logger.log({ type: 'info', msg: 'exiting' });
    process.exit();
  });
}
