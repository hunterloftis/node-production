var amqp = require('amqplib');
var EventEmitter = require('events').EventEmitter;

var DEFAULTS = {
  durable: true,
  prefectch: 1,
  ack: true
};

function JackRabbit(url) {
  EventEmitter.call(this);

  this.connection = null;
  this.channel = null;

  amqp
    .connect(url)
    .then(this.createChannel.bind(this))
    .then(this.onChannel.bind(this));
}

module.exports = function createJackRabbit(url) {
  return new JackRabbit(url);
};

JackRabbit.prototype = Object.create(EventEmitter.prototype);

JackRabbit.prototype.onConnection = function(connection) {
  this.connection = connection;
  this.connection.once('close', this.onClose.bind(this));
  return connection.createChannel();
};

JackRabbit.prototype.onChannel = function(channel) {
  this.channel = channel;
  this.emit('connected', this.connection, this.channel);
};

JackRabbit.prototype.onClose = function() {
  this.emit('disconnected', this.connection);
};

JackRabbit.prototype.onError = function(err) {
  this.emit('error', err);
};

function Queue(channel, name, options) {

}

JackRabbit.prototype.queue = function(name, options) {
  var ch = this.channel;
  var opts = _.extend({}, DEFAULTS, options);
  var ok = ch.assertQueue(name, {
    durable: opts.durable
  });
  ok = ok.then(function() { ch.prefetch(opts.prefetch); });
  ok = ok.then(function() {
    ch.consume(name, onMessage, { noAck: !opts.ack });
  });
  return ok;
};
