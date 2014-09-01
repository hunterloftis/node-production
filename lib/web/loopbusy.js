var loopLag = require('event-loop-lag');

module.exports = function loopbusy(maxLag, interval) {
  var lag = loopLag(interval || 1000);

  return function loopbusy(req, res, next) {
    if (lag() < maxLag) return next();
    var err = new Error('Too busy');
    err.status = 503;
    next(err);
  };
};
