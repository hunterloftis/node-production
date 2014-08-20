var cluster = require('cluster');
var os = require('os');
var http = require('http');
var logger = require('logfmt');

module.exports = function concurrent(count, startFn) {
  if (cluster.isWorker) return startFn(cluster.worker);

  var running = true;
  var timeout;

  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);
  fork();

  function onSignal() {
    process.exit();
    // TODO: send shutdown signal to workers and wait for them to clean up
  }

  function killall() {
    console.log('killall');
    process.exit();
  }

  function fork() {
    cluster.on('exit', revive);
    for (var i = 0; i < count; i++) {
      create(i);
    }
  }

  function create(index) {
    logger.log({ type: 'info', msg: 'forking', worker: index + 1, workers: count });
    cluster.fork();
  }

  function revive(worker, code, signal) {
    if (worker.suicide) return;
    logger.log({ type: 'error', msg: 'worker died', pid: worker.process.pid, signal: signal || code });
    logger.log({ type: 'info', msg: 'restarting', pid: worker.process.pid });
    cluster.fork();
  }
};
