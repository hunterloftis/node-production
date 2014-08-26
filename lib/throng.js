var cluster = require('cluster');
var EventEmitter = require('events').EventEmitter;

module.exports = function(count, startFn) {
  var emitter = new EventEmitter();

  process.on('SIGINT', proxySignal);
  process.on('SIGTERM', proxySignal);

  function proxySignal() {
    emitter.emit('SIGTERM');
  }

  if (cluster.isMaster) {
    forkAll();
    emitter.once('SIGTERM', killall);

    function forkAll() {
      for (var i = 0; i < count; i++) {
        cluster
          .fork()
          .on('disconnect', onDisconnect);
      }
    }

    function killall() {
      for (var id in cluster.workers) {
        var worker = cluster.workers[id];
        console.log('master sending shutdown to worker', id);
        worker.send('shutdown');
        worker.disconnect();
      }
    }

    function onDisconnect() {
      console.log('master saw worker disconnect');
    }
  }
  else if (cluster.isWorker) {
    startFn();
  }
};

