var http = require('http');
var config = require('./config');
var app = require('./lib/app')(config);
var debug = require('./lib/debug')('index');
var server;

if (!module.parent) {
  server = http.createServer(app);

  server.listen(config.port, function() {
    debug('listening on *:' + server.address().port);
  });
}
