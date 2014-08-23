var Promise = require('promise');
var request = require('superagent');
var sentiment = require('sentiment');
var _ = require('lodash');

module.exports = {
  measureSentiment: measureSentiment
};

function measureSentiment(user) {
  return getComments(user).then(analyzeEvents);
}

function getComments(user) {
  return new Promise(function(fulfill, reject) {
    request
      .get(['https://api.github.com/users/', user, '/events/public'].join(''))
      .query({ per_page: 100 })
      .end(function(res) {
        if (res && res.body) fulfill({ user: user, body: res.body});
        else reject(new Error('No response from github'));
      });
  });
}

function analyzeEvents(response) {
  return new Promise(function(fulfill, reject) {

    var user = response.user;
    var events = response.body;

    var comments = events.filter(isComment(user)).map(extractComment);
    var sentiments = comments.map(analyze);
    var total = sentiments.reduce(sum, 0);
    var average = comments.length ? total / comments.length : 0;
    var best = _.max(sentiments, 'comparative');
    var worst = _.min(sentiments, 'comparative');
    var summary = {
      average: average,
      best: best.body,
      worst: worst.body,
      count: comments.length
    };

    fulfill(summary);
  });

  function isComment(user) {
    return function(event) {
      return event.type === 'IssueCommentEvent';
    }
  }

  function extractComment(event) {
    return event.payload.comment.body;
  }

  function analyze(text) {
    var sent = sentiment(text);
    return {
      body: text,
      score: sent.score || 0,
      comparative: sent.comparative || 0
    };
  }

  function sum(current, event) {
    return current + event.comparative;
  }
}
