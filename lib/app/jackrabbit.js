var amqp = require('amqplib');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

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

JackRabbit.prototype.createChannel = function(connection) {
  this.connection = connection;
  this.connection.once('close', this.onClose.bind(this));
  return connection.createChannel();
};

JackRabbit.prototype.onChannel = function(channel) {
  this.channel = channel;
  console.log('saving channel:', this.channel);
  this.emit('connected', this.connection, this.channel);
};

JackRabbit.prototype.onClose = function() {
  this.emit('disconnected', this.connection);
};

JackRabbit.prototype.onError = function(err) {
  this.emit('error', err);
};

JackRabbit.prototype.queue = function(name, options) {
  return new Queue(this.channel, name, options);
};

function Queue(channel, name, options) {
  this.handler = function() {};
  this.name = name;

  var ch = this.channel = channel;
  var opts = _.extend({}, DEFAULTS, options);
  var ok = ch.assertQueue(name, {
    durable: opts.durable
  });
  ok = ok.then(function() { ch.prefetch(opts.prefetch); });
}

Queue.prototype.subscribe = function(handler) {
  this.handler = handler;
  this.channel.consume(this.name, this.onMessage.bind(this), { noAck: !this.ack });
};

Queue.prototype.onMessage = function(msg) {
  var body = msg.content.toString();
  var obj = JSON.parse(body);
  this.handler(obj, function() {
    this.channel.ack(msg);
  }.bind(this));
};

Queue.prototype.publish = function(job) {
  var msg = JSON.stringify(job);
  this.channel.sendToQueue(this.name, new Buffer(msg), { deliveryMode: true });
};
