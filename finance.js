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

var getCompanyName = function(id,ticker){
    console.log('Ticker is: ' + ticker);

    request(getMarketCap(ticker), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var markteJson = JSON.parse(body);
            var companyName = markteJson.query.results.quote.Name;
            var sharePrice = markteJson.query.results.quote.LastTradePriceOnly;
            var marketCapString =
                markteJson.query.results.quote.MarketCapitalization;
            var marketCap = convertMarketCap(marketCapString);
            var result = companyName + "- \n" +
                "Current Price: $" + sharePrice + "\n" +
                "Market Cap: " + marketCapString;
            send_response(id,result);
        }
        else {
            //console.log(error) // Print the shortened url.
            console.log('failure retrieve company name');
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
