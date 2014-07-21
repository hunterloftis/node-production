var express = require('express');

module.exports = function Controller(showErrors) {
  var router = new express.Router();

  return router.use(handleError);

  function handleError(err, req, res, next) {
    res.send(500, 'Something went wrong!');
  }
};

