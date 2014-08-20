var database = require('./database');
var queue = require('./queue');

function App(config) {
  this.db = database(config.mongo_url);
  this.queue = queue(config.rabbit_url);
}

module.exports = function createApp(config) {
  return new App(config);
};

App.prototype.addJob = function(job) {
  this.queue.send(new Buffer(job));
};
