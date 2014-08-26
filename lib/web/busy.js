var toobusy = require('toobusy-middleware');

module.exports = function busy() {
  process.on('SIGINT', exit);

  return toobusy({
    lag: 70,
    message: "Sorry, the server is too busy right now!"
  });
};

function exit() {
  console.log('toobusy exit');
  toobusy.shutdown();
  process.exit();
}
