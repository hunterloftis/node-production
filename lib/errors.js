module.exports = function Controller(showErrors) {

  return function handleError(err, req, res, next) {
    res.send(500, 'Something went wrong!');
  }
};

