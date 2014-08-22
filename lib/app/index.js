var database = require('./database');
var queue = require('./queue');
var ComparisonModel = require('./comparison');

function App(config) {
  this.db = database(config.mongo_url);
  this.queue = queue(config.rabbit_url);
  this.Comparison = ComparisonModel(this.db);

  this.queue.on('job', this.onJob.bind(this));
}

module.exports = function createApp(config) {
  return new App(config);
};

App.prototype.addComparison = function(user1, user2) {
  return this.queue.addJob('comparison', {
    user1: user1,
    user2: user2
  });
};

App.prototype.getComparison = function(id, done) {
  this.Comparison.findById(id, done);
};

App.prototype.startJobs = function() {
  this.queue.startData();
};

App.prototype.onJob = function(data) {

};

App.prototype.stopJobs = function() {
  this.queue.stopData();
}
