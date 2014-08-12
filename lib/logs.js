var morgan = require('morgan');

module.exports = function Logs(quiet) {
  return morgan('dev', {
    skip: quiet ? skipSuccesses : false,
    stream: {
      write: function() { console.log('wtf'); }
    }
  });

  function skipSuccesses(req, res) {
    return res.statusCode < 400;
  }
};
