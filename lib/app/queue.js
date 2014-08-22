var rabbit = require('rabbit.js');
var logger = require('logfmt');
var _ = require('lodash');
var uuid = require('node-uuid');
var EventEmitter = require('events').EventEmitter;

var JOB_QUEUE = 'app.jobs';

function Queue(url) {
  EventEmitter.call(this);
  this.onJob = this.onJob.bind(this);

  this.context = rabbit.createContext(url);
  this.push = this.context.socket('PUSH');
  this.worker = this.context.socket('WORKER', { prefetch: 1 });

  this.jobHandler = function() {};

  this.context.on('ready', this.onReady.bind(this));
  this.context.on('error', this.onError.bind(this));
  this.context.on('close', this.onClose.bind(this));
}

Queue.prototype = Object.create(EventEmitter.prototype);

module.exports = function createQueue(url) {
  return new Queue(url);
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

Queue.prototype.onError = function(err) {
  logger.log({ type: 'error', msg: err, service: 'rabbitmq' });
  throw new Error(err);
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
  this.push.write(data, 'utf-8');
  return id;
};

Queue.prototype.startJobs = function(handler) {
  this.jobHandler = handler;
  this.worker.on('data', this.onJob);
};

Queue.prototype.onJob = function(data) {
  var content = JSON.parse(data);
  logger.log({ type: 'info', msg: 'data', service: 'rabbitmq', data: data });
  this.jobHandler(content, onComplete.bind(this));

  function onComplete(err) {
    if (err) throw err;
    this.worker.ack();
  }
};

Queue.prototype.stopJob = function() {
  this.worker.off('data', this.onJob);
};
