var Promise = require('promise');
var

module.exports = {
  findOverlap: findOverlap
};

function findOverlap(user1, user2, done) {
  var firstFollowers = findFollowers(user1);
  var secondFollowers = findFollowers(user2);

  q
    .when(first, second)
    .then(compareFollowers)
    .then(done);
}

function findFollowers(user) {
  return new Promise(function(resolve, reject) {

  });
}
