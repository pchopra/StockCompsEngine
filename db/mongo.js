var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cis197hw5', function (err) {
  if (err && err.message === 'connect ECONNREFUSED') {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected. Adding seed data...');
  }
});

var db = mongoose.connection;

var keySchema = new mongoose.Schema({
  key: String
});

var productSchema = new mongoose.Schema({
  name: String,
  company: String,
  review: String
});

var Key = mongoose.model('Key', keySchema);
var Product = mongoose.model('Product', productSchema);

module.exports = {
  Key: Key,
  Product: Product,
  mongoose: mongoose,
  db: db.collection('Product')
}
