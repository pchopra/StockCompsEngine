var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var uuid = require('node-uuid');

var keys = require('./routes/keys');

var api = require('./routes/api');
var login = require('./routes/login');
var checkValidKey = require('./middlewares/checkValidKey');

var handleError = require('./middlewares/handleError');
var pageNotFound = require('./middlewares/pageNotFound');

var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');

var isAuthenticated = require('./middlewares/isAuthenticated');
var products = require('./routes/products');

// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/js'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// // parse application/json
// app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/login', function (req, res) {
  console.log("HERE");
  res.render('login.html');
});


app.post('/', function(req, res) {
  console.log("success");
  var body = req.body.stock;
  console.log("Stock Ticker: " + body);

  getStockInfo(body, res); 


});

var getStockInfo = function(data, res) {

	var url = "http://finance.yahoo.com/q/ks?s=" + data + "+Key+Statistics";
	var map = new Object(); 

	request(url, function(error, response, html) {

		if(!error) {
			console.log("Success getting page");
			var $ = cheerio.load(html); 


			//var table = $('.yfnc_datamodoutline1')[0];
			//var market = $(table).children();

			var map = {};

			map['basicInfo'] = $('.title h2').text();
			map['price'] = $('.time_rtq_ticker').text();

			var value; 
		    var td = $('.yfnc_tablehead1');
		    $(td).each(function(j, val) {
		    	value = $(val).text();
		    	//map[value] = 'adsfkdg';
		      if(value.indexOf('Enterprise Value') == 0) {
		      	map['Enterprise Value'] = value; 
		      } else {
		    	map[value] =  'adsfkdf';		      	
		      }

		    });
				    
		
			var keys = Object.keys(map);
			var counter = 2; 

		    var tData = $('.yfnc_tabledata1');
		    $(tData).each(function(j, val) {
		      var value = $(val).text();
		      map[ keys[counter] ] = value;		      	
		      counter++;
		    });

		    
		    for(var k in map) {
		    	console.log(k + " " + map[k]);
		    	//console.log(k + ": " + map[k]);
		    }
					    

		    var result = {
		    	stock: map['basicInfo'],
		    	price: map['price'], 
		    	marketCap: map['Market Cap (intraday)5:'],
		    	ev: map['Enterprise Value'],
		    	revenue: map['Revenue (ttm):'],
		    	ebitda: map['EBITDA (ttm)6:'], 
		    	netIncome: map['Net Income Avl to Common (ttm):'],
		    	ev_ebitda: map['Enterprise Value/Revenue (ttm)'],
		    	ev_rev: map['Enterprise Value/Revenue (ttm):'],
		    	p_e: map['Trailing P/E (ttm, intraday):'],
		    	p_s: map['Price/Sales (ttm):']
		    };
			
			res.json(result);

		} else {
			console.log("shit");
		}
	}) 

}

app.use('/', keys);

// Generate a random cookie secret for this app
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
}

// TODO (Part 3) - Use the cookieSession middleware. The above function
// can be used to generate a secret key.
app.use(cookieSession( {
 name: 'session',
 secret: generateCookieSecret
}));

app.use(bodyParser.urlencoded({
 extended: false
}));


// Mount your routers. Please use good style here: mount a single router per use() call,
// preceded only by necessary middleware functions.
// DO NOT mount an 'authenticating' middleware function in a separate call to use().
// For instance, the API routes require a valid key, so mount checkValidKey and apiRouter in the same call.
// app.use('/api', checkValidKey, api);
// app.use('/', login);
// app.use('/products', isAuthenticated, products);

// Mount your error-handling middleware.
// Please mount each middleware function with a separate use() call.
app.use(handleError);
app.use(pageNotFound);


module.exports = app;
