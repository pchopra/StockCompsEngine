$(function () {
  var SearchView = Backbone.View.extend({
    el: $('#portfolio-manager'),
    events: {
      // TODO: Define events
      //'keyup #search' : 'search',
      'click .add-stock' : 'addStock'
    },

    appendToContainer: function (html, $container, data) {
      $(Mustache.render(html, data)).appendTo($container);
    },

    render: function () {
      // TODO: Empty the search container and the suggestion container and render the search bar.
      var searchDiv = $('#search-template').html();

      var location = $('body').find('#search-container');

      this.appendToContainer(searchDiv, location, '');
    },

    search: function () {
      // TODO: Search for a stock given the input
      // You should use client.searchStock() to do the actual searching; see Client.js.
      var query = $('#search').val();

      /*
      var resultsContainer = $('#result-container');
      var tableHeader = $('#table-headers'); 
      var resultsTemplate = $('#result-template');

      var temp = this;

      var callback = function(results) {
       
        resultsContainer.empty();
        if (results.length !== 0) {
        temp.appendToContainer(tableHeader.html(), resultsContainer, '');
        }
        results.forEach(function(value) {
          temp.appendToContainer(resultsTemplate.html(), resultsContainer, value);
        
      });

      };
      */
      client.searchStock(query, callback);
     
    },

    addStock: function (e) {
      // TODO: Use AJAX to send something to Express 
      var query = $('#search').val();

      console.log("Add Stock: " + query);

      var callback = function(data) {

          if( (data.ebitda === undefined && data.revenue === undefined) || query.length === 0 ) {
            alert("Invalid Stock Ticker. Please try again.");
          } else {

          var stockEV_Ebitda = parseFloat(data.ev) / parseFloat(data.ebitda); 
          var stockEV_Rev = parseFloat(data.ev) / parseFloat(data.revenue); 

          var newStock = new Stock( {

              symbol: data.stock,
              price: data.price, 
              marketCap: data.marketCap,
              ev: data.ev,
              revenue: data.revenue,
              ebitda: data.ebitda, 
              netIncome: data.netIncome,
              //ev_ebitda: data.ev_ebitda,
              ev_ebitda: stockEV_Ebitda.toFixed(2),
              //ev_rev: data.ev_rev,
              ev_rev: stockEV_Rev.toFixed(2),
              p_e: data.p_e,
              p_s: data.p_s
          });

          var seen = portfolioCollection.where({symbol: newStock.get('symbol')});
          if (seen.length === 0) {
            portfolioCollection.add(newStock);
          }

          //Display the average 
          var avg = portfolioCollection.where({symbol: 'Average'});

          if(avg.length === 0) {
            //average hasn't been added in yet, add it in 
            var average = new Stock( {

              symbol: 'Average',
              price: '-', 
              marketCap: '-',
              ev: '-',
              revenue: '-',
              ebitda: '-', 
              netIncome: '-',
              ev_ebitda: data.ev_ebitda,
              ev_rev: data.ev_rev,
              p_e: data.p_e,
              p_s: data.p_s
            }) 

            portfolioCollection.add(average);
          } else {

            portfolioCollection.remove(avg); 

            
            
            var evEbitdaRatio = portfolioCollection.filter(function(stock) {
              return stock.get('ev_ebitda') !== 'N/A';
            });

            var evRev = portfolioCollection.filter(function(stock) {
              return stock.get('ev_rev') !== 'N/A';
            });

            var pe = portfolioCollection.filter(function(stock) {
              return stock.get('p_e') !== 'N/A';
            });

            var ps = portfolioCollection.filter(function(stock) {
              return stock.get('p_s') !== 'N/A';
            });

            var var1 = 0.00; //ev_ebitda 
            for(var k in evEbitdaRatio) {
              //console.log('P/E: ' + evEbitdaRatio[k].get('ev_ebitda'));
              if(evEbitdaRatio[k].get('ev_ebitda').indexOf('K') !== -1) {
                var1 += (parseFloat(evEbitdaRatio[k].get('ev_ebitda'))) * 1000; 
              } else {
                var1 += parseFloat(evEbitdaRatio[k].get('ev_ebitda')); 
              }
            }
            var1 = var1 / evEbitdaRatio.length;

            var var2 = 0.00; //ev_rev
            for(var k in evRev) {
              //console.log('P/E: ' + evRev[k].get('ev_rev'));
              var2 += parseFloat(evRev[k].get('ev_rev')); 
            }
            var2 = var2 / evRev.length;

            var var3 = 0.00; //pe
            for(var k in pe) {
              //console.log('P/E: ' + evRev[k].get('ev_rev'));
              var3 += parseFloat(pe[k].get('p_e')); 
            }
            var3 = var3 / pe.length;

            var var4 = 0.00; //ps
            for(var k in ps) {
              //console.log('P/E: ' + evRev[k].get('ev_rev'));
              var4 += parseFloat(ps[k].get('p_s')); 
            }
            var4 = var4 / ps.length;

            var average = new Stock( {
              symbol: 'Average',
              price: '-', 
              marketCap: '-',
              ev: '-',
              revenue: '-',
              ebitda: '-', 
              netIncome: '-',
              ev_ebitda: var1.toFixed(2),
              ev_rev: var2.toFixed(2),
              p_e: var3.toFixed(2),
              p_s: var4.toFixed(2)
            }) 

            portfolioCollection.add(average);

          }
      }
        console.log(newStock);
        $('.search').val('');


      }
    
      $.ajax({
            type: 'POST',
            url: '/',
            data: {stock: query},
            success: function(data){
              callback(data);
            }

      });

      /*
      var newStock = new Stock( {
        symbol: $(e.target).attr('symbol'), 
        price: $(e.target).attr('price')
      });

      var seen = portfolioCollection.where({symbol: newStock.get('symbol')});
      if (seen.length === 0) {
        portfolioCollection.add(newStock);
      }
      */
    },

  });

  window.searchView = new SearchView();
});