var express = require('express');
var router = express.Router();

// Provided - do not modify
var authenticate = function (username, password) {
  return username === 'admin' && password === 'password';
};

// Implement the routes.
router.get('/loginAdmin', function (req, res, next) {
 res.render('login');
});

router.post('/loginAdmin', function (req, res, next) {
 var username = req.body.username;
 var pswd = req.body.password;

 if (authenticate(username, pswd) === true) {
  req.session.isAuthenticated = true; 
  res.send('Logged in as admin');
 } else {
  res.redirect('/loginAdmin');
 }

});

module.exports = router;
