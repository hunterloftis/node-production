var express = require('express');
var path = require('path');

module.exports = function pagesRouter(app) {

  return new express.Router()
    .get('/', listPages)
    .get('/page/:pageId', showPage);
    .post('/page', addPage);

  function listPages(req, res, next) {
    app
      .listPages(30)
      .then(sendList, next);

    function sendList(list) {
      res.render(path.join(__dirname, 'list'), { pages: list });
    }
  }

  function addPage(req, res, next) {
    app
      .addPage(req.body.url)
      .then(sendLink, next);

    function sendLink(id) {
      res
        .status(202)
        .json({ link: '/page/' + id });
    }
  }

  function showPage(req, res, next) {
    app
      .getPage(req.params.pageId)
      .then(sendPage, next);

    function sendPage(page) {
      res.json(page);
    }
  }
};
