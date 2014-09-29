var express = require('express');
var path = require('path');

module.exports = function articlesRouter(app) {

  return new express.Router()
    .get('/', showForm)
    .get('/articles.json', listArticles)
    .get('/articles/:articleId.json', showArticle)
    .post('/articles.json', addArticle)
    .use(express.static(path.join(__dirname, 'public')));

  function showForm(req, res, next) {
    res.render(path.join(__dirname, 'list'));
  }

  function listArticles(req, res, next) {
    app
      .listArticles(15)
      .then(sendList, next);

    function sendList(list) {
      res.json(list);
    }
  }

  function addArticle(req, res, next) {
    app
      .addArticle(req.body.url)
      .then(sendLink, next);

    function sendLink(id) {
      res.json({ link: '/articles/' + id + '.json' });
    }
  }

  function showArticle(req, res, next) {
    app
      .getArticle(req.params.articleId)
      .then(sendArticle, next);

    function sendArticle(article) {
      res.json(article);
    }
  }
};
