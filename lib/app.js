var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var sessions = require('./sessions');
var database = require('./database');
var debug = require('./debug')('app');
var users = require('./users');
var errors = require('./errors');

module.exports = function App(config) {
  var app = express();
  var db = database(config.mongo_url);

  app
    .set('view engine', 'jade')
    .use(favicon())
    .use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser(config.cookie_secret))
    .use(sessions(config.redis_url, config.session_secret))
    .use(flash())
    .use(users(db))
    .use(notFound)
    .use(errors(config.show_errors));

  return app;
};

function notFound(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
};
