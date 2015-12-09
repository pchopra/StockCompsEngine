$(function () {
  var Client = function () {
    this.hostname = 'https://stock-sim.herokuapp.com/';
    this.socket = io.connect(this.hostname);
    this.setupListeners();
  };

  Client.prototype.getStockData = function (symbols) {
    this.socket.emit('stockData', symbols, function (data) {
      window.portfolioCollection.set(data);
    });
  };

  Client.prototype.searchStock = function (query, callback) {
    this.socket.emit('searchStock', query, function (results) {
      console.log(results);
      callback(results);
    });
  };

  Client.prototype.updatePortfolio = function () {
    var symbols = window.portfolioCollection.map(function (model) {
      return model.attributes.symbol;
    });
    window.client.getStockData(symbols);
  };

  Client.prototype.setupListeners = function () {
    // this.socket.on('update', function () {
    //   window.searchView.search();
    //   this.updatePortfolio();
    // }.bind(this));
  };

  window.client = new Client();
});