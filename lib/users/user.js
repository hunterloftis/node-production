var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

module.exports = function EntryModel(connection) {

  var Schema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true }
  });

  Schema.statics.findAll = function(done) {
    return this.find().exec();
  };

  Schema.statics.create = function(username, password, done) {
    var passValidationError = validatePassword(password);
    if (passValidationError) return done(passValidationError);

    bcrypt.genSalt(10, createHash);

    function createHash(err, salt) {
      if (err) return done(err);
      bcrypt.hash(password, salt, createUser);
    }

    function createUser(err, hash) {
      console.error('Bcrypt error:', err);
      if (err) return done(err);
      new User({ username: username, hash: hash }).save(done);
    }
  };

  Schema.statics.authenticate = function(username, password, done) {
    console.log('username:', username, 'password:', password);
    this.findOne({ username: username }, handleUser);

    function handleUser(err, user) {
      if (err || !user) return done(new Error("Couldn't locate user " + username));
      bcrypt.compare(password, user.hash, handlePassword);

      function handlePassword(err, match) {
        if (match) return done(null, user);
        return done(new Error("Incorrect password"));
      }
    }
  };

  var User = connection.model('User', Schema);

  return User;
};

function validatePassword(password) {
  if (password.length < 8) return new Error("Password must be at least 8 characters");
}

