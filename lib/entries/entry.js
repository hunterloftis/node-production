var mongoose = require('mongoose');

module.exports = function EntryModel(connection) {

  var Schema = mongoose.Schema({
    text: String
  });

  Schema.statics.findAll = function(done) {
    return this.find().exec();
  };

  Schema.statics.create = function(text, done) {
    var entry = new Entry({ text: text });
    entry.save(done);
  };

  var Entry = connection.model('Entry', Schema);

  return Entry;
};
