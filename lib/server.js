var cluster = require('cluster');
var os = require('os');
var http = require('http');
var logfmt = require('logfmt');
var log = logfmt.log.bind(logfmt);

var config = require('./config');
var app = require('./app');
var web = require('./web');

if (!module.parent) {
  if (cluster.isMaster) master();
  else worker();
}

function master() {
  var workerCount = config.concurrent ? os.cpus().length : 1;

  cluster.on('exit', revive);
  for (var i = 0; i < workerCount; i++) {
    create(i, workerCount);
  }

  function create(count, total) {
    log({ type: 'info', msg: 'forking', worker: count + 1, workers: total });
    cluster.fork();
  }

  function revive(worker, code, signal) {
    log({ type: 'error', msg: 'worker died', pid: worker.process.pid, signal: signal || code });
    log({ type: 'info', msg: 'restarting', pid: worker.process.pid });
    cluster.fork();
  }
}

function worker() {
  var instance = web(app(config), config);
  var server = http.createServer(instance);
  server.listen(config.port, onListen);

  function onListen() {
    log({ type: 'info', msg: 'listening', port: server.address().port });
  }
}

