var database = require('./database');
var queue = require('./queue');
var ComparisonModel = require('./comparison');
var logger = require('logfmt');

function App(config) {
  this.db = database(config.mongo_url);
  this.queue = queue(config.rabbit_url);
  this.Comparison = ComparisonModel(this.db);

  this.queue.on('job', this.onJob.bind(this));
}

module.exports = function createApp(config) {
  return new App(config);
};

App.prototype.queueComparison = function(user1, user2) {
  return this.queue.addJob('comparison', {
    user1: user1,
    user2: user2
  });
};

App.prototype.getComparison = function(id, done) {
  this.Comparison.findById(id, done);
};

App.prototype.doComparison = function(job) {
  logger.log({ type: 'info', msg: 'comparison', job: job });
};

App.prototype.startJobs = function() {
  this.queue.startData();
};

App.prototype.stopJobs = function() {
  this.queue.stopData();
};

App.prototype.onJob = function(job) {
  logger.log({ type: 'info', msg: 'job', job: job });
  if (job.type === 'comparison') this.doComparison(job);
};
