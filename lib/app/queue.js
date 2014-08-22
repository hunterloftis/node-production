var rabbit = require('rabbit.js');
var logger = require('logfmt');
var _ = require('lodash');
var uuid = require('node-uuid');
var EventEmitter = require('events').EventEmitter;

var PUB_SOCKET = 'PUBLISH';
var SUB_SOCKET = 'SUBSCRIBE';
var JOB_QUEUE = 'app.jobs';

function Queue(url) {
  EventEmitter.call(this);

  this.onData = this.onData.bind(this);

  this.context = rabbit.createContext(url);
  this.pub = null;
  this.sub = null;

  this.context.on('ready', this.onReady.bind(this));
  this.context.on('error', this.onError.bind(this));
  this.context.on('close', this.onClose.bind(this));
}

Queue.prototype = Object.create(EventEmitter.prototype);

module.exports = function createQueue(url) {
  return new Queue(url);
};

Queue.prototype.onReady = function() {
  this.pub = this.context.socket(PUB_SOCKET);
  this.pub.connect(JOB_QUEUE, this.onPublishConnect.bind(this));

  this.sub = this.context.socket(SUB_SOCKET);
  this.sub.connect(JOB_QUEUE, this.onSubscribeConnect.bind(this));
};

Queue.prototype.onPublishConnect = function() {
  logger.log({ type: 'info', msg: 'connected', socket: 'publish', service: 'rabbitmq' });
};

Queue.prototype.onSubscribeConnect = function() {
  logger.log({ type: 'info', msg: 'connected', socket: 'subscribe', service: 'rabbitmq' });
};

Queue.prototype.onError = function(err) {
  logger.log({ type: 'error', msg: err, service: 'rabbitmq' });
};

Queue.prototype.onClose = function() {
  logger.log({ type: 'error', msg: 'closed', service: 'rabbitmq' });
  throw new Error('Disconnected from rabbit');
};

Queue.prototype.addJob = function(type, obj) {
  var id = uuid.v1();
  var contents = _.extend({}, obj, {
    type: type,
    id: id
  });
  var data = JSON.stringify(contents);
  this.pub.write(data, 'utf-8');
  return id;
};

Queue.prototype.startData = function() {
  this.sub.on('data', this.onData);
};

Queue.prototype.onData = function(data) {
  logger.log({ type: 'info', msg: 'message', service: 'rabbitmq', content: data });
};

Queue.prototype.stopData = function() {
  this.sub.off('data', this.onData);
};
