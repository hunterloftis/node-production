var morgan = require('morgan');

module.exports = function Logs(quiet) {
  return morgan('dev', {
    skip: quiet ? skipSuccesses : false,
    buffer: 3000
  });

  function skipSuccesses(req, res) {
    return res.statusCode < 400;
  }
};
