var express = require('express');

module.exports = function Controller(showErrors) {

  return showErrors ? debugError : friendlyError;

  function logError(err, req, res, next) {
    console.error('Caught error in middleware:', err.stack || err.toString());
  }

  function debugError(err, req, res, next) {
    logError(err);
    res
      .status(500)
      .send(err.stack || err.toString());
  }

  function friendlyError(err, req, res, next) {
    logError(err);
    res
      .status(500)
      .send('Something went wrong!');
  }
};

