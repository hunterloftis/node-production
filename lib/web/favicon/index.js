var favicon = require('serve-favicon');
var path = require('path');

module.exports = function(iconPath) {
  var filepath = iconPath || path.join(__dirname, 'node-favicon.png');
  return favicon(filepath);
}
