var logger = require('logfmt');
var Promise = require('promise');
var uuid = require('node-uuid');

var connections = require('./connections');
var ArticleModel = require('./article-model');

function App(config) {
  var service = connections(config.mongo_url, config.rabbit_url);
  this.db = service.db;
  this.rabbit = service.rabbit;
  this.scrapeQueue = this.rabbit.queue('jobs.scrape', {
    durable: true,
    prefectch: 5
  });
  this.Article = ArticleModel(this.db);
}

module.exports = function createApp(config) {
  return new App(config);
};

App.prototype.addArticle = function(url) {
  var id = uuid.v1();
  this.scrapeQueue.publish({ id: id, url: url });
  return Promise.resolve(id);
};

App.prototype.scrapeArticle = function(id, url) {
  return this.Article.scrape(id, url);
};

App.prototype.getArticle = function(id) {
  return this.Article.get(id);
};

App.prototype.listArticles = function(n) {
  return this.Article.list(n);
};

App.prototype.startScraping = function() {
  this.scrapeQueue.subscribe(function(job, done) {
    this.scrapeArticle(job.id, job.url).nodeify(done);
  }.bind(this));
  return this;
};

App.prototype.stopScraping = function() {
  this.scrapeQueue.unsubscribe();
  return this;
};

App.prototype.reset = function() {
  return this.Article.deleteAll();
};

App.prototype.shutdown = function() {
  this.db.close();
  this.queue.close();
};
