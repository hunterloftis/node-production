var express = require('express');
var EntryModel = require('./entry');

module.exports = function Controller(db) {
  var Entry = EntryModel(db);
  var router = new express.Router();

  router
    .get('/', fetchEntries, showEntries)
    .post('/entries', createEntry, redirectHome);

  return router;

  function fetchEntries(req, res, next) {
    //Entry.find().exec().then(onSuccess, next);
    next(new Error('wtf'));
  }

  function showEntries(req, res, next) {
    res.send('showEntries');
  }

  function createEntry(req, res, next) {
    next();
  }

  function redirectHome(req, res, next) {
    res.redirect('/');
  }
};

