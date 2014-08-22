var rabbit = require('rabbit.js');
var logger = require('logfmt');

var SUB_SOCKET = 'SUBSCRIBE';
var JOB_QUEUE = 'app.jobs';

function Worker(config) {
  this.context = null;
  this.jobs = null;
  this.rabbit_url = config.rabbit_url;
}

module.exports = function createWorker(config) {
  return new Worker(config);
};

Worker.prototype.start = function() {
  this.context = rabbit.createContext(this.rabbit_url);

  this.context.on('ready', this.onReady.bind(this));
  this.context.on('error', this.onError.bind(this));
  this.context.on('close', this.onClose.bind(this));
}

Worker.prototype.onReady = function() {
  this.jobs = this.context.socket(SUB_SOCKET);
  this.jobs.connect(JOB_QUEUE, this.onConnect.bind(this));
};

Worker.prototype.onConnect = function() {
  logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
  this.jobs.on('data', this.onJob.bind(this));
};

Worker.prototype.onError = function(err) {
  logger.log({ type: 'error', msg: err, service: 'rabbitmq' });
};

Worker.prototype.onClose = function() {
  logger.log({ type: 'error', msg: 'closed', service: 'rabbitmq' });
  throw new Error('Disconnected from rabbit');
};

Worker.prototype.onJob = function(data) {
  logger.log({ type: 'info', msg: 'message', service: 'rabbitmq', content: data });
};
