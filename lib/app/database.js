var mongoose = require('mongoose');
var logger = require('logfmt');

module.exports = function Database(url) {
  var db = mongoose.createConnection(url);

  db.on('connected', function() {
    logger.log({ type: 'info', msg: 'connected', service: 'mongodb' });
  });

  db.on('error', function(err) {
    logger.log({ type: 'error', msg: err, service: 'mongodb' });
  });

  db.on('close', function(str) {
    logger.log({ type: 'error', msg: 'closed', service: 'mongodb' });
  });

  db.on('disconnected', function() {
    logger.log({ type: 'error', msg: 'disconnected', service: 'mongodb' });
    throw new Error('Disconnected from mongo');
  });

  return db;
};
