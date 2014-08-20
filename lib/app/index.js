var database = require('./database');

function App(config) {
  this.db = database(config.mongo_url);
}

module.exports = function createApp(config) {
  return new App(config);
};
