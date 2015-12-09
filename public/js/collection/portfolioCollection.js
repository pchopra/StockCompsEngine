	$(function () {
	  var PortfolioCollection = Backbone.Collection.extend({
	  	model: Stock
  });
  window.portfolioCollection = new PortfolioCollection();
});