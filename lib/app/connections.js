var mongoose = require('mongoose');
var jackrabbit = require('./jackrabbit');
var logger = require('logfmt');
var EventEmitter = require('events').EventEmitter;

function Connector(mongoUrl, rabbitUrl) {
  EventEmitter.call(this);

  var self = this;
  var dbReady = false;
  var brokerReady = false;

  this.db = mongoose.createConnection(mongoUrl)
    .on('connected', function() {
      dbReady = true;
      logger.log({ type: 'info', msg: 'connected', service: 'mongodb' });
      ready();
    })
    .on('error', function(err) {
      logger.log({ type: 'error', msg: err, service: 'mongodb' });
    })
    .on('close', function(str) {
      logger.log({ type: 'error', msg: 'closed', service: 'mongodb' });
    })
    .on('disconnected', function() {
      logger.log({ type: 'error', msg: 'disconnected', service: 'mongodb' });
      lost();
    });

  this.broker = jackrabbit(rabbitUrl)
    .on('connected', function() {
      brokerReady = true;
      logger.log({ type: 'info', msg: 'connected', service: 'rabbitmq' });
      ready();
    })
    .on('error', function(err) {
      logger.log({ type: 'error', msg: err, service: 'rabbitmq' });
    })
    .on('disconnected', function() {
      logger.log({ type: 'error', msg: 'disconnected', service: 'rabbitmq' });
      lost();
    });

  function ready() {
    if (dbReady && brokerReady) {
      self.emit('ready');
    }
  }

  function lost() {
    self.emit('lost');
    throw new Error('Lost connection');
  }
};

module.exports = function(mongoUrl, rabbitUrl) {
  return new Connector(mongoUrl, rabbitUrl);
};

Connector.prototype = Object.create(EventEmitter);

