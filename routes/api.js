var express = require('express');
var router = express.Router();
var productsDb = require('../db/product');

// Implement the routes.

router.get('/viewProducts', function (req, res, next) {
 var cb = function (err, products) { 
  if (err === null) { 
   res.json(products);
  } else {
     next(err); 
  }
  }; 

 productsDb.getAllProducts(cb);
});

router.get('/search/:id', function (req, res, next) {
 
 var productID = req.params.id; 
 var cb = function (error, product) { 

 if (error === null) {
  res.json(product);
 } else {
    next(error);
 }
 };

 productsDb.getProduct(productID, cb);
});

module.exports = router;
