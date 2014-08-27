var cpus = require('os').cpus().length;

var throng = require('./throng');
var config = require('./config');
var app = require('./app');

throng(config.concurrent ? cpus: 1, start);

function start(worker) {
  console.log("I am a worker");
  app(config).startScraping();

  worker.on('shutdown', function() {
    process.exit();
  });
}
