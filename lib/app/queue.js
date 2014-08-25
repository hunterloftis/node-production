var rabbit = require('rabbit.js');
var logger = require('logfmt');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var Promise = require('promise');

var JOB_QUEUE = 'app.jobs';
var NOOP = function() {};

function Queue(url, handlers) {
  EventEmitter.call(this);
  this.onData = this.onData.bind(this);

  this.handlers = handlers;

  this.context = rabbit.createContext(url);
  this.push = this.context.socket('PUSH');
  this.worker = this.context.socket('WORKER', { prefetch: 1 });

  this.context.on('ready', this.onReady.bind(this));
  this.context.on('close', this.onClose.bind(this));
}

Queue.prototype = Object.create(EventEmitter.prototype);

module.exports = function createQueue(url, handlers) {
  return new Queue(url, handlers);
};

Queue.prototype.close = function() {
  this.context.close();
};

Queue.prototype.onReady = function() {
  this.push.connect(JOB_QUEUE, this.onPublishConnect.bind(this));
  this.worker.connect(JOB_QUEUE, this.onSubscribeConnect.bind(this));
};

Queue.prototype.onPublishConnect = function() {
  logger.log({ type: 'info', msg: 'connected', socket: 'publish', service: 'rabbitmq' });
};

Queue.prototype.onSubscribeConnect = function() {
  logger.log({ type: 'info', msg: 'connected', socket: 'subscribe', service: 'rabbitmq' });
};

Queue.prototype.onClose = function() {
  logger.log({ type: 'error', msg: 'closed', service: 'rabbitmq' });
  throw new Error('Disconnected from rabbit');
};

Queue.prototype.addJob = function(type, obj) {
  var contents = _.extend({}, obj, { type: type });
  var data = JSON.stringify(contents);
  this.push.write(data, 'utf-8');
};

Queue.prototype.startProcessing = function(handler) {
  this.jobHandler = handler || NOOP;
  this.worker.on('data', this.onData);
};

Queue.prototype.stopProcessing = function() {
  this.worker.off('data', this.onData);
};

Queue.prototype.onData = function(data) {
  logger.log({ type: 'info', msg: 'data', service: 'rabbitmq', data: data });

  var self = this;
  var job = JSON.parse(data);
  var handler = self.handlers[job.type] || noHandler;

  handler(job).then(onSuccess, onFail);

  function onSuccess() {
    logger.log({ type: 'info', msg: 'acknowledging', service: 'rabbitmq' });
    self.worker.ack();  // TODO: how does rabbit know which message we're acknowledging? should I include an id here or something?
  }

  function onFail(err) {
    logger.log({ type: 'error', msg: err });
    self.worker.ack();                        // TODO: retry logic here
  }

  function noHandler(job) {
    return Promise.reject(new Error('No handler for job type: ' + job.type));
  }
};
