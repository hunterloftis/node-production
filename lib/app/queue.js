var logger = require('logfmt');
var amqp = require('amqplib/callback_api');

var JOB_QUEUE = 'jobs';

function Queue(url) {
  var self = this;

  amqp.connect(url, onConnect);

  function onConnect(err, connection) {
    if (err) throw err;
    logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
    connection.createChannel(onChannel);
  }

  function onChannel(err, channel) {
    if (err) throw err;
    logger.log({ type: 'info', msg: 'opened', service: 'rabbitmq'});
    channel.assertQueue(JOB_QUEUE);
    self.channel = channel;
  }
}

module.exports = function createQueue(url) {
  return new Queue(url);
};

Queue.prototype.send = function(contents) {
  this.channel.sendToQueue(JOB_QUEUE, contents);
};
