var mongoose = require('mongoose');
var debug = require('./debug')('database');

module.exports = function Database(url) {
  var db = mongoose.createConnection(url, {
    auto_reconnect: true
  });

  db.on('connected', function() {
    debug('connected to mongo');
  });

  db.on('error', function(err) {
    debug('mongo error:', err);
  });

  db.on('close', function(str) {
    debug('mongo socket closed:', str);
  });

  db.on('disconnected', function() {
    debug('disconnected from mongo');
    throw new Error('Disconnected from mongo');
  });

  return db;
};
