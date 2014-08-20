var cluster = require('cluster');
var os = require('os');
var http = require('http');
var logger = require('logfmt');

module.exports = function concurrent(startFn, count) {
  if (cluster.isMaster) master();
  else startFn();

  function master() {
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
    logger.log({ type: 'error', msg: 'worker died', pid: worker.process.pid, signal: signal || code });
    logger.log({ type: 'info', msg: 'restarting', pid: worker.process.pid });
    cluster.fork();
  }
};
