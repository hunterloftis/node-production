var express = require('express');
var EntryModel = require('./entry');

module.exports = function Controller(db) {
  var Entry = EntryModel(db);
  var router = new express.Router();

  router
    .get('/', fetchEntries, listEntries)
    .post('/entries', createEntry, redirectHome);

  return router;

  function fetchEntries(req, res, next) {
    Entry.findAll().then(passEntries, next);

    function passEntries(entries) {
      res.entries = entries;
      next();
    }
  }

  function listEntries(req, res, next) {
    res.render('list');
  }

  function createEntry(req, res, next) {
    Entry.create(req.body.text).then(onCreate, next);

    function onCreate(entry) {
      next();
    }
  }

  function redirectHome(req, res, next) {
    res.redirect('/');
  }
};

