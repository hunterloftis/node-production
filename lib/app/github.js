var Promise = require('promise');
var request = require('superagent');
var sentiment = require('sentiment');
var _ = require('lodash');

module.exports = {
  measureSentiment: measureSentiment
};

function measureSentiment(repo) {
  return getComments(repo).then(analyzeComments);
}

function getComments(repo) {
  return new Promise(function(fulfill, reject) {
    console.log('getComments');
    request
      .get(['https://api.github.com/repos/', repo, '/issues/comments'].join(''))
      .query({ per_page: 100 })
      .end(function(res) {
        if (res && res.body) fulfill(res.body);
        else reject(new Error('No response from github'));
      });
  });
}

function analyzeComments(comments) {
  return new Promise(function(fulfill, reject) {
    console.log('analyzeComments');
    console.log("Got comments:", comments.length);

    var sentiments = comments.map(analyze);
    var total = sentiments.reduce(sum, 0);
    var average = total / sentiments.length;
    var best = _.max(sentiments, 'comparative');
    var worst = _.min(sentiments, 'comparative');
    var summary = {
      average: average,
      best: best.body,
      worst: worst.body
    };

    console.log('summary:', summary);

    fulfill(summary);
  });

  function analyze(comment) {
    var sent = sentiment(comment.body);
    return {
      body: comment.body,
      score: sent.score || 0,
      comparative: sent.comparative || 0
    };
  }

  function sum(current, comment) {
    return current + comment.comparative;
  }
}
