var debug = require('debug');

module.exports = function log(name) {
  return debug('Node-Production:' + name);
};
