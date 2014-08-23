var Promise = require('promise');
var request = require('superagent');
var sentiment = require('sentiment');
var _ = require('lodash');

module.exports = {
  measureSentiment: measureSentiment
};

function measureSentiment(user) {
  return getComments(user)
    .then(analyzeEvents);
}

function getComments(user) {
  return new Promise(function(fulfill, reject) {
    console.log('getComments');
    request
      .get(['https://api.github.com/search/issues?q=commenter:', user].join(''))
      .query({ per_page: 100 })
      .end(function(res) {
        if (res && res.body) fulfill({ user: user, body: res.body});
        else reject(new Error('No response from github'));
      });
  });
}

function analyzeEvents(opts) {
  return new Promise(function(fulfill, reject) {
    console.log('analyzeEvents');

    var user = opts.user;
    var events = opts.body;

    console.log('events:', events.items.length);

    var comments = events.items.filter(isComment(user)).map(extractComment);
    console.log('Filtered comments:', comments.length);
    var sentiments = comments.map(analyze);
    var total = sentiments.reduce(sum, 0);
    var average = total / comments.length;
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

  function isComment(user) {
    return function(event) {
      return event.user && event.user.login === user && event.body;
    }
  }

  function extractComment(event) {
    return event.body;
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
