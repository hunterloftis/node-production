var morgan = require('morgan');

module.exports = function Logs(quiet) {
  return morgan('dev', {
    skip: quiet ? skipSuccesses : false
  });

  function skipSuccesses(req, res) {
    return res.statusCode < 400;
  }
};
