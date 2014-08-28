var logger = require('logfmt');
var Promise = require('promise');
var uuid = require('node-uuid');

var database = require('./database');
var queue = require('./queue');
var ArticleModel = require('./article-model');

function App(config) {
  this.db = database(config.mongo_url);
  this.queue = queue(config.rabbit_url, {
    scrape: this.scrapeArticle.bind(this)
  });
  this.Article = ArticleModel(this.db);
}

module.exports = function createApp(config) {
  return new App(config);
};

App.prototype.addArticle = function(url) {
  var id = uuid.v1();
  this.queue.addJob('scrape', { id: id, url: url });
  return Promise.resolve(id);
};

App.prototype.scrapeArticle = function(job) {
  return this.Article.scrape(job.id, job.url);
};

App.prototype.getArticle = function(id) {
  return this.Article.get(id);
};

App.prototype.listArticles = function(n) {
  return this.Article.list(n);
};

App.prototype.startScraping = function() {
  this.queue.startProcessing();
  return this;
};

App.prototype.stopScraping = function() {
  this.queue.stopProcessing();
  return this;
};

App.prototype.reset = function() {
  return this.Article.deleteAll();
}

App.prototype.shutdown = function() {
  console.log('Shutting down');
  this.db.close();
  this.queue.close();
}
