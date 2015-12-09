var mongo = require('./mongo');

module.exports = {
  getAllProducts: function (callback) {
    mongo.Product.find(function (error, products) {
      callback(error, products);
    });
  },

  getProduct: function (_id, callback) {
    mongo.Product.findById(_id, function (error, product) {
      callback(error, product);
    });
  },

  addProduct: function (productData, callback) {
    var product = new mongo.Product(productData);
    product.save(function (error) {
      callback(error);
    });
  }
};
