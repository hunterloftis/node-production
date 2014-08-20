var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);
var logfmt = require('logfmt');
var log = logfmt.log.bind(logfmt);

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
    log({ type: 'info', msg: 'connected', service: 'redis' });
  });

  store.client.on('error', function(err) {
    log({ type: 'error', msg: 'error', service: 'redis', err: err });
  });

  store.client.on('end', function() {
    log({ type: 'error', msg: 'disconnected', service: 'redis' });
    throw new Error('Disconnected from redis');
  });

  return session;
};
