var mongoose = require('mongoose');
var crypto = require('crypto');
var logger = require('logfmt');

var STATES = ['pending', 'complete', 'failed'];

module.exports = function Comparison(connection) {

  var Schema = mongoose.Schema({
    user1: { type: String, required: true },
    user2: { type: String, required: true },
    state: { type: String, required: true, enum: STATES },
    results: [ String ]
  });

  Schema.statics.create = function(user1, user2, done) {
    var id = Comparison.userHash(user1, user2);

    logger.log({ type: 'info', msg: 'comparing', user1: user1, user2: user2, id: id });
    //done(null, comparison);
    done(null);
  };

  Schema.statics.userHash = function(user1, user2) {
    var users = [user1, user2]
      .sort()
      .join('');

    return crypto
      .createHash('md5')
      .update(users, 'utf-8')
      .digest('hex');
  };

  var Comparison = connection.model('Comparison', Schema);
  return Comparison;
};

