var logfmt = require('logfmt');
var log = logfmt.log.bind(logfmt);
var amqp = require('amqplib');

function Worker(config) {
  this.rabbit_url = config.rabbit_url;

  log({ type: 'info', msg: 'created worker' });
}

Worker.prototype.start = function() {
  log({ type: 'info', msg: 'starting worker' });

  amqp.connect(this.rabbit_url).then(onConnect);

  function onConnect(connection) {
    log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
  }
};

module.exports = function createWorker(config) {
  return new Worker(config);
};
