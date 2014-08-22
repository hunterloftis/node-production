var Promise = require('promise');
var request = require('superagent');
var sentiment = require('sentiment');

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
      .get('https://api.github.com/repos/jquery/jquery/issues/comments')
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
    fulfill();
  });
}
