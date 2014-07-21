var mongoose = require('mongoose');
var debug = require('./debug')('database');

module.exports = function Database(url) {
  var db = mongoose.createConnection(url);

  db.on('connected', function() {
    debug('connected to mongo');
  });

  return db;
};
