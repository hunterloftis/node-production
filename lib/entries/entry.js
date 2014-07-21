var mongoose = require('mongoose');

module.exports = function EntryModel(connection) {

  var Schema = mongoose.Schema({
    text: String
  });

  var Entry = connection.model('Entry', Schema);

  return Entry;
};
