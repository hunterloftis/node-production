var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var crypto = require('crypto');
var logger = require('logfmt');
var Promise = require('promise');
var summarize = require('summarize');
var superagent = require('superagent');

var STATES = ['pending', 'complete', 'failed'];

module.exports = function createPageModel(connection) {

  var Schema = mongoose.Schema({
    _id: { type: String },
    url: { type: String, unique: true, index: true },
    title: { type: String },
    image: { type: String },
    topics: [ String ],
    sentiment: { type: Number },
    words: { type: Number },
    difficulty: { type: Number },
    minutes: { type: Number }
  });

  Schema.plugin(timestamps);

  Schema.statics.scrape = function(id, url) {
    return new Promise(function(resolve, reject) {
      var Page = this;
      console.log("GETTING URL:", url);
      superagent
        .get(url)
        .on('error', reject)
        .end(onResponse);

      function onResponse(res) {
        console.log("STATUS:", res.status);
        var summary = summarize(res.text, 10);
        if (!summary.ok) return reject(new Error('Unable to scrape'));
        logger.log({ type: 'info', msg: 'summary', id: id, url: url, topics: summary.topics })
        new Page({ _id: id, url: url })
          .set(summary)
          .save(onSave);
      }

      function onSave(err, page) {
        if (err) {
          logger.log({ type: 'error', msg: 'saving', url: url });
          return reject(err);
        }
        logger.log({ type: 'info', msg: 'saved', url: url });
        return resolve(page);
      }

    }.bind(this));
  };

  Schema.statics.get = Promise.denodeify(Schema.statics.findById);

  Schema.statics.list = function(n) {
    return new Promise(function(resolve, reject) {
      this.find().sort('-createdAt').limit(n || 50).exec(function(err, pages) {
        if (err) return reject(err);
        logger.log({ type: 'info', msg: 'list', pages: pages.length });
        resolve(pages);
      });
    }.bind(this));
  };

  Schema.statics.deleteAll = function() {
    return new Promise(function(resolve, reject) {
      this.remove().exec(function(err) {
        if (err) return reject(err);
        resolve();
      });
    }.bind(this));
  };

  var Page = connection.model('Page', Schema);
  return Page;
};
