var logger = require('logfmt');
var Promise = require('promise');
var uuid = require('node-uuid');
var EventEmitter = require('events').EventEmitter;

var connections = require('./connections');
var ArticleModel = require('./article-model');

function App(config) {
  EventEmitter.call(this);

  this.connections = connections(config.mongo_url, config.rabbit_url);
  this.connections.once('ready', this.onConnected.bind(this));
  this.connections.once('lost', this.onLost.bind(this));
}

module.exports = function createApp(config) {
  return new App(config);
};

App.prototype = Object.create(EventEmitter.prototype);

App.prototype.onConnected = function() {
  this.Article = ArticleModel(this.connections.db);
  this.scrapeQueue = this.connections.broker.queue('jobs.scrape', {
    durable: true,
    prefetch: 5
  });
  this.scrapeQueue.once('ready', this.onReady.bind(this));
};

App.prototype.onReady = function() {
  this.emit('ready');
};

App.prototype.onLost = function() {
  this.shutdown();
}

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
  this.scrapeQueue.subscribe(function scrapeJob(job, done) {
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
  this.emit('shutdown');
  this.db.close();
  this.queue.close();
};
