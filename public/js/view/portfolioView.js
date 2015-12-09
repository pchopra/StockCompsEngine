$(function () {
  var PortfolioView = Backbone.View.extend({
    el: $('#portfolio-manager'),

    initialize: function() {
      // TODO: Set the collection to event listeners
      this.listenTo(portfolioCollection, 'add', this.onChange);
      this.listenTo(portfolioCollection, 'remove', this.onChange);
      this.listenTo(portfolioCollection, 'set', this.onChange);
    },

    onChange: function () {
      // TODO: Set what happens when changes are made
      this.render();
    },

    events: {
      // TODO: Define events
      'click #delete-stock' : 'deleteStock'
    },

    appendToContainer: function (html, container, data) {
      $(Mustache.render(html,data)).appendTo(container);
    },

    render: function () {
      // TODO: Render the portfolio that houses all of the added stocks
      var portfolioContainer = $('#portfolio-container');
      portfolioContainer.empty();

      var tableHeaders = $('#table-headers');
      this.appendToContainer(tableHeaders.html(), portfolioContainer, '');

      var jsonForm = portfolioCollection.toJSON();

      var portfolioTemplate = $('#portfolio-template');

      for (var k in jsonForm) {
        this.appendToContainer(portfolioTemplate.html(), 
          portfolioContainer, jsonForm[k]);

      }
    },

    deleteStock: function (e) {
      // TODO: Delete a stock from our collection
      var location = portfolioCollection.where({symbol: $(e.target).attr('symbol')});
      portfolioCollection.remove(location);
    },

  });
  window.portfolioView = new PortfolioView({collection: window.portfolioCollection});
});
