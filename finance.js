var request = require('request');
//Page token
var token = 'CAADezUPr1f4BAAJK2uB7UZCDm5eJtKE5xLdP5FZCFzHoNM7MQHfKDXdHHci0qFj3aGIhHBSOsxBfGudFu7jhvXRzVBK284dD7rr0tuveFjtBEMxDqVwDOBiSJM7SytpXGJrY2i3wlZBZAZCxlV4GzbwXtuGfmlkhD6xituWUHLu64saY8rIZAm6FSqZC9YRqRlcJwMIPTus5gZDZD';

module.exports = {
  ResponseMessage: function (id,ticker) {
    getCompanyName(id,ticker);
  },
  bar: function () {
    // whatever
  }
};

var getMarketCap = function(symbol){
    return "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + symbol + "%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
}

var queryRatios = function(symbol){
    return "https://api.import.io/store/data/d53a442a-94ef-45b8-acd7-d2bcac37b007/_query?input/webpage/url=http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fks%3Fs%3D" + symbol + "%2BKey%2BStatistics&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D"
}

var getCompanyName = function(id,ticker){
    console.log('Ticker is: ' + ticker);

    request(getMarketCap(ticker), function (error, response, body) {
        if (!error && response.statusCode == 200 && body) {
            var markteJson = JSON.parse(body);
            var companyName = markteJson.query.results.quote.Name;
            if(!companyName){
                send_bad_response(id, ticker);
                return;//this is important! otherwise you pass empty value down
            }
            var sharePrice = markteJson.query.results.quote.LastTradePriceOnly;
            var marketCapString =
                markteJson.query.results.quote.MarketCapitalization;
            var marketCap = convertMarketCap(marketCapString);
            var peRatio = markteJson.query.results.quote.PERatio;
            var priceBook = markteJson.query.results.quote.PriceBook;
            var divYield = markteJson.query.results.quote.DividendYield;
            var result = companyName + "-" +
                "\nCurrent Price: $" + sharePrice +
                "\nMarket Cap: " + marketCapString +
                "\nP/E Ratio: " + peRatio +
                "\nP/B Ratio: " + priceBook +
                "\nYield: " + divYield;
            //getRatios(id,ticker, result);
            send_response(id,result);
        }
        else {
            //console.log(error) // Print the shortened url.
            console.log('failure retrieve company name');
            send_bad_response(id, ticker);
        }
      
    });
}

function send_response(id,respond_message){
    var postAddress = 'https://graph.facebook.com/v2.6/me/messages?access_token=' + token;

    var options = {
      uri: postAddress,
      method: 'POST',
      json: { "recipient": 
            { "id": id },
            "message":
            { "text": respond_message}
        }
    };
    request(options, function (error, response, body) {
      if (error) {
        //console.log(error) // Print the shortened url.
          console.log('failure to send to clients');
      }
        if (response) {
        console.log(response) // Print the shortened url.
      }
    })
}

function send_bad_response(id, ticker){
    var error_response = ticker + "?? Sorry man don't know what you're talkin about."
    send_response(id,error_response);
}

var convertMarketCap = function(value){
    if(value == null) return 0;
    var decimalValue = parseString(value.substring(0, value.length - 1));
    if(value.slice(-1) == 'M'){
        return (decimalValue*1.0e+6);
    }
    else return (decimalValue*(1.0e+9));
};

var parseString = function(value){
    var isPositive = true;
    var temp = value;
    if(value.indexOf('(') !== -1)
    {
        temp = temp.substring(1, value.length - 1);
        isPositive = false;
    }
    temp = temp.replace(/,/g, "");
    temp = temp.replace(/-/g, "0");
    if(isPositive){
        temp = parseFloat(temp);
    }
    else{
        temp = -1*parseFloat(temp);
    }
    return temp;
};
