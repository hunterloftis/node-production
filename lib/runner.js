var cpus = require('os').cpus().length;

var concurrent = require('./concurrent');
var config = require('./config');
var app = require('./app');
var worker = require('./worker');

concurrent(config.concurrent ? cpus: 1, start);

function start() {
  var instance = worker(app(config), config);
  instance.start();
}
