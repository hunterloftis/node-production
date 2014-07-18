var express = require('express');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var mongoose = require('mongoose');

var defaults = require('./defaults');

var REDIS_URL = process.env.REDISTOGO_URL || defaults.redis_url;
var MONGO_URL = process.env.MONGOHQ_URL || defaults.mongo_url;
var PORT = process.env.PORT || defaults.port;

var app = express();

var store = new RedisStore({
  url: REDIS_URL
});

var session = expressSession({
  secret: 'mySecret',
  store: store
});

var db = mongoose.createConnection(MONGO_URL);

app
  .use(session)
  .get('/', fetchEntries, showEntries)
  .post('/entries', createEntry, redirectHome);

app.listen(port, function() {
  console.log('listening on *:' + port);
});

function fetchEntries(req, res, next) {

}

function showEntries(req, res, next) {

}

function createEntry(req, res, next) {

}

function redirectHome(req, res, next) {

}
