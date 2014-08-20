var logfmt = require('logfmt');
var log = logfmt.log.bind(logfmt);
var amqp = require('amqplib/callback_api');

var JOB_QUEUE = 'jobs';

function Worker(config) {
  this.rabbit_url = config.rabbit_url;

  log({ type: 'info', msg: 'created worker' });
}

Worker.prototype.start = function() {
  var self = this;

  log({ type: 'info', msg: 'starting worker' });
  amqp.connect(this.rabbit_url, onConnect);

  function onConnect(err, connection) {
    if (err) throw err;
    log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
    connection.createChannel(onChannel);
  }

  function onChannel(err, channel) {
    if (err) throw err;
    log({ type: 'info', msg: 'opened', service: 'rabbitmq'});
    channel.assertQueue(JOB_QUEUE);
    channel.consume(JOB_QUEUE, onMessage);

    function onMessage(msg) {
      self.handleMessage(msg);
      channel.ack(msg);
    }
  }
};

Worker.prototype.handleMessage = function(msg) {
  log({ type: 'info', msg: 'message', service: 'rabbitmq', content: msg.content.toString() });
};

module.exports = function createWorker(config) {
  return new Worker(config);
};
