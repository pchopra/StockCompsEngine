$(function () {
  var TickerRouter = Backbone.Router.extend({
    routes: {
      // TODO: Set routes
      '' : 'index'
    },

    index: function () {
      // TODO: Render searchView and PortfolioView
      window.searchView.render();
      window.portfolioView.render();

    },

  });
  window.tickerRouter = new TickerRouter();
  Backbone.history.start({pushState: false});
});