var config = require('./lib/config');
var app = require('./lib/app')(config);
var debug = require('./lib/debug')('index');

if (!module.parent) {
  app.listen(config.port, function() {
    debug('listening on *:' + config.port);
  });
}
