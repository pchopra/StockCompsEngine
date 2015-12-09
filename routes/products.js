var express = require('express');
var router = express.Router();
var productsDb = require('../db/product');

// Implement the routes.

router.get('/new', function (req, res, next) {
 res.render('addproduct');
});

router.post('/new', function (req, res, next) {
 if (req.body && req.body.name && req.body.review && req.body.company) {
  var cb = function (error) {
   if (error !== null) {
    next(error);
   } else {
      res.send('Success');
   }
 };

 productsDb.addProduct(req.body, cb);

 } else {
    res.redirect('/products/new');
 }


});


module.exports = router;
