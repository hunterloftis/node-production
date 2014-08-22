var rabbit = require('rabbit.js');
var logger = require('logfmt');
var _ = require('lodash');
var uuid = require('node-uuid');

var PUB_SOCKET = 'PUBLISH';
var JOB_QUEUE = 'app.jobs';

function Queue(url) {
  this.context = rabbit.createContext(url);
  this.jobs = null;

  this.context.on('ready', this.onReady.bind(this));
  this.context.on('error', this.onError.bind(this));
  this.context.on('close', this.onClose.bind(this));
}

module.exports = function createQueue(url) {
  return new Queue(url);
};

Queue.prototype.onReady = function() {
  this.jobs = this.context.socket(PUB_SOCKET);
  this.jobs.connect(JOB_QUEUE, this.onConnect.bind(this));
};

Queue.prototype.onConnect = function() {
  logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
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
  jobs.write(data, 'utf-8');
  return id;
};
