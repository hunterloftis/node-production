var express = require('express');
var sessions = require('./sessions');
var database = require('./database');
var debug = require('./debug')('app');

module.exports = function App(config) {
  var app = express();
  var session = sessions(config.redis_url, config.session_secret);
  var db = database(config.mongo_url);

  app
    .use(session)
    .get('/', fetchEntries, showEntries)
    .post('/entries', createEntry, redirectHome);

  return app;

  function fetchEntries(req, res, next) {

  }

  function showEntries(req, res, next) {

  }

  function createEntry(req, res, next) {

  }

  function redirectHome(req, res, next) {

  }
};

