var cpus = require('os').cpus().length;

var concurrent = require('./concurrent');
var config = require('./config');
var worker = require('./worker');

concurrent(config.concurrent ? cpus: 1, start);

function start() {
  var instance = worker(config);
  instance.start();
}
