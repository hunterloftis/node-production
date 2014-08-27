var cpus = require('os').cpus().length;

var throng = require('./throng');
var config = require('./config');
var app = require('./app');

throng(config.concurrent ? cpus: 1, start);

function start(worker) {
  app(config).startScraping();

  worker.on('shutdown', function() {
    logger.log({ type: 'info', msg: 'exiting' });
    process.exit();
  });
}
