var cluster = require('cluster');
var cpus = require('os').cpus().length;
var http = require('http');
var config = require('./config');
var app = require('./lib/app')(config);
var debug = require('./lib/debug')('index');

if (!module.parent) {
  if (cluster.isMaster) master();
  else worker();
}

function master() {
  cluster.on('exit', revive);

  for(var i = 0; i < cpus; i++) {
    create(i, cpus);
  }

  function create(i, total) {
    debug('Forking worker %d / %d ...', i, total);
    cluster.fork();
  }

  function revive(worker, code, signal) {
    console.error('Worker %d died (%s), restarting...', worker.process.pid, signal || code)
    cluster.fork();
  }
}

function worker() {
  var server = http.createServer(app);

  server.listen(config.port, function() {
    debug('listening on *:' + server.address().port);
  });
}

