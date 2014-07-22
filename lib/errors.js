var express = require('express');

module.exports = function Controller(showErrors) {

  return showErrors ? debugError : friendlyError;

  function logError(err, req, res, next) {
    console.error('Caught error in middleware:', err.stack || err.toString());
  }

  function debugError(err, req, res, next) {
    logError(err);
    res.send(500, err.stack || err.toString());
  }

  function friendlyError(err, req, res, next) {
    logError(err);
    res.send(500, 'Something went wrong!');
  }
};

