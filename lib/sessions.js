var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var debug = require('./debug')('sessions');

module.exports = function Sessions(url, secret) {
  var store = new RedisStore({
    url: url
  });

  var session = expressSession({
    secret: secret,
    store: store,
    resave: true,
    saveUninitialized: true
  });

  store.client.on('connect', function() {
    debug('connected to redis');
  });

  store.client.on('error', function(err) {
    debug('redis error:', err);
  });

  store.client.on('end', function() {
    debug('disconnected from redis');
    throw new Error('Disconnected from redis');
  });

  return session;
};
