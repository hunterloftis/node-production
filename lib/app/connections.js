var mongoose = require('mongoose');
var jackrabbit = require('./jackrabbit');
var logger = require('logfmt');

module.exports = function connect(mongoUrl, rabbitUrl) {
  var db = mongoose.createConnection(mongoUrl)
    .on('connected', function() {
      logger.log({ type: 'info', msg: 'connected', service: 'mongodb' });
    })
    .on('error', function(err) {
      logger.log({ type: 'error', msg: err, service: 'mongodb' });
    })
    .on('close', function(str) {
      logger.log({ type: 'error', msg: 'closed', service: 'mongodb' });
    })
    .on('disconnected', function() {
      logger.log({ type: 'error', msg: 'disconnected', service: 'mongodb' });
      throw new Error('Disconnected from mongodb');
    });

  var rabbit = jackrabbit(rabbitUrl)
    .on('connected', function() {
      logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
    })
    .on('error', function(err) {
      logger.log({ type: 'error', msg: err, service: 'rabbitmq' });
    })
    .on('disconnected', function() {
      logger.log({ type: 'error', msg: 'disconnected', service: 'rabbitmq' });
      throw new Error('Disconnected from rabbitmq');
    });

  return {
    db: db,
    rabbit: rabbit
  };
};
