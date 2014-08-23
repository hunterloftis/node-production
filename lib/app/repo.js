var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var crypto = require('crypto');
var logger = require('logfmt');

var github = require('./github');

var STATES = ['pending', 'complete', 'failed'];

module.exports = function Repo(connection, staleTime) {

  var Schema = mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true, validate: isRepo },
    sentiment: { type: Number },
    best: { type: String },
    worst: { type: String }
  });

  Schema.plugin(timestamps);

  Schema.statics.analyze = function(name, done) {
    logger.log({ type: 'info', msg: 'analyzing', name: name });
    Repo.findOne({ name: name }, onFound);

    function onFound(err, existing) {
      if (existing && Date.now() - existing.updatedAt < staleTime) {
        console.log('found existing:', existing);
        return done(null, existing);
      }

      console.log('calling github');

      github
        .measureSentiment(name)
        .then(saveSentiment, handleError);

      function saveSentiment(sentiment) {
        console.log('saving sentiment with name:', name);
        var repo = existing || new Repo({ name: name });
        repo
          .set({
            sentiment: sentiment.average,
            best: sentiment.best,
            worst: sentiment.worst
          })
          .save(done);
      }

      function handleError(err) {
        done(err);
      }
    }
  };

  var Repo = connection.model('Repo', Schema);
  return Repo;
};

function isRepo(str) {
  if (!str) return false;
  if (str.length < 3) return false;
  if (str.split('/').length !== 2) return false;
  return true;
}

