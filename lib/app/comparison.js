var mongoose = require('mongoose');

var STATES = ['pending', 'complete', 'failed'];

module.exports = function Comparison(connection) {

  var Schema = mongoose.Schema({
    username: { type: String, required: true, enum: STATES },
    results: [ String ]
  });

  var Comparison = connection.model('Comparison', Schema);

  return Comparison;
};
