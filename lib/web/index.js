var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');

// Shared modules and middleware
var sessions = require('./sessions');
var errors = require('./errors');
var logs = require('./logs');
var favicon = require('./favicon');
//var busy = require('./busy');
var notFound = require('./notfound');

// Routers
var pages = require('./pages/router');

module.exports = function Web(app, config) {
  var web = express();

  // Express configuration
  web
    .set('view engine', 'jade')
    .set('view cache', config.view_cache);

  // Shared middleware
  web
    // .use(busy())
    .use(favicon())
    .use(timeout(config.timeout))
    .use(logs(config.quiet))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser(config.cookie_secret))
    .use(sessions(config.redis_url, config.session_secret));

  // Routers for feature groups
  web
    .use(pages(app));

  // Shared error handling
  web
    .use(notFound())
    .use(errors(config.show_errors));

  return web;
};
