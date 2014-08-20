var cpus = require('os').cpus().length;

var concurrent = require('./concurrent');
var config = require('./config');
var worker = require('./worker');

if (!module.parent) {
  concurrent(createWorker, config.concurrent ? cpus : 1);

  function createWorker() {
    var instance = worker(config);
    instance.start();
  }
}
