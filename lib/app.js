var express = require('express');
var ejs = require('ejs');

var sessions = require('./sessions');
var database = require('./database');
var debug = require('./debug')('app');
var entries = require('./entries');
var errors = require('./errors');

module.exports = function App(config) {
  var app = express();
  var db = database(config.mongo_url);

  app
    .set('view engine', 'html')
    .engine('html', ejs.renderFile)
    .use(sessions(config.redis_url, config.session_secret))
    .use(entries(db))
    .use(errors(config.show_errors));

  return app;
};

