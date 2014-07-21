var express = require('express');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var mongoose = require('mongoose');

var defaults = require('./defaults');

var REDIS_URL = process.env.REDISTOGO_URL || defaults.redis_url;
var MONGO_URL = process.env.MONGOHQ_URL || defaults.mongo_url;
var PORT = process.env.PORT || defaults.port;
var SECRET = process.env.SESSION_SECRET || defaults.session_secret;

var app = express();

var store = new RedisStore({
  url: REDIS_URL
});

var session = expressSession({
  secret: SECRET,
  store: store,
  resave: true,
  saveUninitialized: true
});

var db = mongoose.createConnection(MONGO_URL);

db.on('connected', function() {
  console.log('connected to mongo');
});

store.client.on('connect', function() {
  console.log('connected to redis');
});

app
  .use(session)
  .get('/', fetchEntries, showEntries)
  .post('/entries', createEntry, redirectHome);

app.listen(PORT, function() {
  console.log('listening on *:' + PORT);
});

function fetchEntries(req, res, next) {

}

function showEntries(req, res, next) {

}

function createEntry(req, res, next) {

}

function redirectHome(req, res, next) {

}
