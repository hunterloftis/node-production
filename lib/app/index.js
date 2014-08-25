var logger = require('logfmt');
var Promise = require('promise');
var uuid = require('node-uuid');

var database = require('./database');
var queue = require('./queue');
var PageModel = require('./page-model');

function App(config) {
  this.db = database(config.mongo_url);
  this.queue = queue(config.rabbit_url, {
    scrape: this.scrapePage.bind(this)
  });
  this.Page = PageModel(this.db);
}

module.exports = function createApp(config) {
  return new App(config);
};

App.prototype.addPage = function(url) {
  var id = uuid.v1();
  this.queue.addJob('scrape', { id: id, url: url });
  return Promise.resolve(id);
};

App.prototype.scrapePage = function(job) {
  return this.Page.scrape(job.id, job.url);
};

App.prototype.getPage = function(id) {
  return this.Page.get(id);
};

App.prototype.listPages = function(n) {
  return this.Page.list(n);
};

App.prototype.startScraping = function() {
  this.queue.startProcessing();
};

App.prototype.stopScraping = function() {
  this.queue.stopProcessing();
};
