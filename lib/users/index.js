var express = require('express');
var path = require('path');
var UserModel = require('./user');

var homeView = path.join(__dirname, 'home');
var dashboardView = path.join(__dirname, 'dashboard');
var signinView = path.join(__dirname, 'signin');

module.exports = function Controller(db) {
  var User = UserModel(db);
  var router = new express.Router();

  router.param('userId', fetchUser);

  router
    .get('/', showHome, showDashboard)
    .post('/signup', createUser, redirectHome)
    .get('/signin', showSignin, redirectHome)
    .post('/signin', createSession, redirectHome)
    .get('/test', timeoutThis)
    .all('/signout', destroySession, redirectHome);

  return router;

  function timeoutThis(req, res, next) {

  }

  function fetchUser(req, res, next, id) {
    User.findById(id, function(err, user) {
      req.user = user;
      next();
    });
  }

  function createSession(req, res, next) {
    User.authenticate(req.body.username, req.body.password, updateSession);

    function updateSession(err, user) {
      if (!err && user) req.session.user = user;
      else req.flash('error', "Sorry, that login doesn't match.");
      return next();
    }
  }

  function destroySession(req, res, next) {
    req.session.destroy(next);
  }

  function redirectHome(req, res, next) {
    res.redirect('/');
  }

  function showHome(req, res, next) {
    if (req.session.user) return next();
    res.render(homeView);
  }

  function showDashboard(req, res, next) {
    if (!req.session.user) return next();
    res.render(dashboardView, { name: req.session.user.username });
  }

  function showSignin(req, res, next) {
    if (req.session.user) return next();
    res.render(signinView);
  }

  function createUser(req, res, next) {
    if (req.session.user) return next();
    User.create(req.body.username, req.body.password, updateSession);

    function updateSession(err, user) {
      if (!err && user) req.session.user = user;
      else req.flash('error', "Sorry, please try again.");
      return next();
    }
  }

};

