var cpus = require('os').cpus().length;

var concurrent = require('./concurrent');
var config = require('./config');
var app = require('./app');

concurrent(config.concurrent ? cpus: 1, start);

function start() {
  app(config).startScraping();
}
