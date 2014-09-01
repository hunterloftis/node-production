var express = require('express');
var logger = require('logfmt');

module.exports = function Controller(showErrors) {

  return showErrors ? debugError : friendlyError;

  function logError(err, req, res, next) {
    logger.log({ type: 'error', msg: 'middleware error', err: err.stack || err.toString() });
  }

  function debugError(err, req, res, next) {
    logError(err);
    res
      .status(err.status || 500)
      .send(err.stack || err.toString());
  }

  function friendlyError(err, req, res, next) {
    logError(err);
    res
      .status(err.status || 500)
      .send('Something went wrong!');
  }
};

