var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var crypto = require('crypto');
var logger = require('logfmt');

var twitter = require('./twitter');

var STATES = ['pending', 'complete', 'failed'];
var FIVE_MIN = 1000 * 60 * 5;

module.exports = function Comparison(connection) {

  var Schema = mongoose.Schema({
    user1: { type: String, required: true },
    user2: { type: String, required: true },
    overlap: [ String ]
  });

  Schema.plugin(timestamps);

  Schema.statics.create = function(user1, user2, done) {
    var id = Comparison.userHash(user1, user2);

    logger.log({ type: 'info', msg: 'comparing', user1: user1, user2: user2, id: id });
    Comparison.findById(id, onFound);

    function onFound(err, exists) {
      if (exists && Date.now() - exists.updatedAt < FIVE_MIN) return done(null, exists);
      }
      twitter.findOverlap(user1, user2, onCompare);
    }

    function onCompare(err, overlap) {
      new Comparison({
        id: id,
        user1: user1,
        user2: user2,
        overlap: overlap
      }).save(done);
    }
  };

  Schema.statics.userHash = function(user1, user2) {
    var users = [user1, user2]
      .sort()
      .join('---&&---');

    return crypto
      .createHash('md5')
      .update(users, 'utf-8')
      .digest('hex');
  };

  var Comparison = connection.model('Comparison', Schema);
  return Comparison;
};

