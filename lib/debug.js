var debug = require('debug');
var config = require('./config');

module.exports = function log(name) {
  return debug(config.app_name + ':' + name);
};
