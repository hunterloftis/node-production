var mongoose = require('mongoose');
var logfmt = require('logfmt');
var log = logfmt.log.bind(logfmt);

module.exports = function Database(url) {
  var db = mongoose.createConnection(url);

  db.on('connected', function() {
    log({ type: 'info', msg: 'connected', service: 'mongodb' });
  });

  db.on('error', function(err) {
    log({ type: 'error', msg: 'error', service: 'mongodb', err: err });
  });

  db.on('close', function(str) {
    log({ type: 'error', msg: 'closed', service: 'mongodb', err: str });
  });

  db.on('disconnected', function() {
    log({ type: 'error', msg: 'disconnected', service: 'mongodb' });
    throw new Error('Disconnected from mongo');
  });

  return db;
};
