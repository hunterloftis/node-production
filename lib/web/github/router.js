var express = require('express');
var path = require('path');

module.exports = function twitterRouter(app) {
  var router = new express.Router();

  router
    .param('repoName', fetchAnalysis)
    .get('/', showForm)
    .post('/analysis', queueAnalysis)
    .get('/analysis/:repoName', showAnalysis);

  return router;

  function showForm(req, res, next) {
    res.render(path.join(__dirname, 'form'));
  }

  function queueAnalysis(req, res, next) {
    var id = app.queueAnalysis(req.body.repo);
    res
      .status(202)
      .send({ link: '/analysis/' + id });
  }

  function fetchAnalysis(req, res, next, id) {
    app.getAnalysis(id, onAnalysis);

    function onAnalysis(err, analysis) {
      if (err) return next(err);
      req.analysis = analysis;
    }
  }

  function showAnalysis(req, res, next) {
    res.send(req.analysis);
  }
};
