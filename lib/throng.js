var cluster = require('cluster');
var EventEmitter = require('events').EventEmitter;

var KILL_TIME = 5000;
var NOOP = function() {};

module.exports = function(count, startFn) {

  if (cluster.isWorker) {
    process.on('SIGINT', NOOP);
    process.on('SIGTERM', NOOP);
    return startFn();
  }

  var emitter = new EventEmitter();
  var running = true;

  listen();
  fork();

  function listen() {
    cluster.on('exit', revive);
    emitter.once('shutdown', shutdown);
    process
      .on('SIGINT', proxySignal)
      .on('SIGTERM', proxySignal);
  }

  function fork() {
    for (var i = 0; i < count; i++) {
      cluster.fork();
    }
  }

  function proxySignal() {
    emitter.emit('shutdown');
  }

  function shutdown() {
    running = false;
    for (var id in cluster.workers) {
      cluster.workers[id].process.kill();
    }
    setTimeout(forceKill, KILL_TIME).unref();
  }

  function revive(worker, code, signal) {
    if (running) cluster.fork();
  }

  function forceKill() {
    for (var id in cluster.workers) {
      cluster.workers[id].kill();
    }
  }
};

