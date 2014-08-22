var logger = require('logfmt');

var database = require('./database');
var queue = require('./queue');
var RepoModel = require('./repo');
var github = require('./github');

function App(config) {
  this.db = database(config.mongo_url);
  this.queue = queue(config.rabbit_url);
  this.Repo = RepoModel(this.db);
}

module.exports = function createApp(config) {
  return new App(config);
};

App.prototype.queueAnalysis = function(repo) {
  return this.queue.addJob('analysis', { repo: repo });
};

App.prototype.doAnalysis = function(job, done) {
  if (job.type !== 'analysis') return false;

  logger.log({ type: 'info', msg: 'analysis', job: job });
  this.Repo.analyze(job.repo, done);
  return true;
};

App.prototype.getAnalysis = function(id, done) {
  this.Repo.findById(id, done);
};

App.prototype.startJobs = function() {
  this.queue.startJobs(this.onJob.bind(this));
};

App.prototype.stopJobs = function() {
  this.queue.stopJobs();
};

App.prototype.onJob = function(job, done) {
  logger.log({ type: 'info', msg: 'job', job: job });

  if (this.doAnalysis(job, done)) return;

  logger.log({ type: 'warn', msg: 'no matching job type', jobType: job.type });
  done();
};
