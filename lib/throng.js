var cluster = require('cluster');
var EventEmitter = require('events').EventEmitter;

var KILL_TIME = 5000;

module.exports = function(count, startFn) {
  var running = true;
  var emitter = new EventEmitter();

  process.on('SIGINT', proxySignal);
  process.on('SIGTERM', proxySignal);

  function proxySignal() {
    emitter.emit('shutdown');
  }

  if (cluster.isMaster) {

    init();

    function init() {
      cluster.on('exit', revive);
      emitter.once('shutdown', shutdown);
      for (var i = 0; i < count; i++) fork();
    }

    function shutdown() {
      running = false;
      setTimeout(forceKill, KILL_TIME).unref();
    }

    function fork() {
      return cluster
        .fork()
        .on('disconnect', onDisconnect);
    }

    function revive(worker, code, signal) {
      emitter.emit('death', worker, code, signal);
      if (running) fork();
    }

    function forceKill() {
      emitter.emit('kill');
      for (var id in cluster.workers) {
        cluster.workers[id].kill();
      }
    }

    function onDisconnect(worker) {
      emitter.emit('disconnect', worker);
    }
  }
  else if (cluster.isWorker) {
    startFn(emitter);
  }
};

