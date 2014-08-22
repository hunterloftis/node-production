var express = require('express');
var path = require('path');

module.exports = function twitterRouter(app) {
  var router = new express.Router();

  router
    .param('comparisonId', fetchComparison)
    .get('/', showComparisonForm)
    .post('/compare', createComparison)
    .get('/compare/:comparisonId', showComparison);

  return router;

  function showComparisonForm(req, res, next) {
    res.render(path.join(__dirname, 'comparison'));
  }

  function createComparison(req, res, next) {
    var id = app.queueComparison(req.body.user1, req.body.user2);
    res
      .status(202)
      .send({ link: '/compare/' + id });
  }

  function fetchComparison(req, res, next, id) {
    app.getComparison(id, onComparison);

    function onComparison(err, comparison) {
      if (err) return next(err);
      req.comparison = comparison;
    }
  }

  function showComparison(req, res, next) {
    res.send(req.comparison);
  }
};
