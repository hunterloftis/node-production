var express = require('express');
var path = require('path');

module.exports = function pagesRouter(app) {

  return new express.Router()
    .use(express.static(path.join(__dirname, 'public')))
    .get('/', showForm)
    .get('/pages.json', listPages)
    .get('/pages/:pageId.json', showPage)
    .post('/pages.json', addPage);

  function showForm(req, res, next) {
    res.render(path.join(__dirname, 'list'));
  }

  function listPages(req, res, next) {
    app
      .listPages(30)
      .then(sendList, next);

    function sendList(list) {
      res.json(list);
    }
  }

  function addPage(req, res, next) {

    console.log("BODY:", req.body);

    app
      .addPage(req.body.url)
      .then(sendLink, next);

    function sendLink(id) {
      res
        .status(202)
        .json({ link: '/pages/' + id + '.json' });
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
