var database = require('./database');
var queue = require('./queue');
var ComparisonModel = require('./comparison');
var logger = require('logfmt');

function App(config) {
  this.db = database(config.mongo_url);
  this.queue = queue(config.rabbit_url);
  this.Comparison = ComparisonModel(this.db);
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

App.prototype.doComparison = function(job, done) {
  logger.log({ type: 'info', msg: 'comparison', job: job });
  this.Comparison.create(job.user1, job.user2, done);
};

App.prototype.getComparison = function(id, done) {
  this.Comparison.findById(id, done);
};

App.prototype.startJobs = function() {
  this.queue.startJobs(this.onJob.bind(this));
};

App.prototype.stopJobs = function() {
  this.queue.stopJobs();
};

App.prototype.onJob = function(job, done) {
  logger.log({ type: 'info', msg: 'job', job: job });

  if (job.type === 'comparison') return this.doComparison(job, done);

  logger.log({ type: 'warn', msg: 'no matching job type', jobType: job.type });
  done();
};
