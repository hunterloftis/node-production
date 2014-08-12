var cluster = require('cluster');
var os = require('os');
var http = require('http');
var config = require('./config');
var app = require('./lib/app');
var debug = require('./lib/debug')('index');

if (!module.parent) {
  if (cluster.isMaster) master();
  else worker();
}

function master() {
  var workers = config.concurrent ? os.cpus().length : 1;
  var i;

  cluster.on('exit', revive);
  for (i = 0; i < workers; i++) {
    create(i, workers);
  }

  function create(i, total) {
    debug('Forking worker %d / %d ...', i + 1, total);
    cluster.fork();
  }

  function revive(worker, code, signal) {
    console.error('Worker %d died (%s), restarting...', worker.process.pid, signal || code)
    cluster.fork();
  }
}

function worker() {
  var server = http.createServer(app(config));

  server.listen(config.port, function() {
    debug('listening on *:' + server.address().port);
  });
}

