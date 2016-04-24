var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.text());
app.use(bodyParser.json());


//Page token
var token = 'CAADezUPr1f4BAAJK2uB7UZCDm5eJtKE5xLdP5FZCFzHoNM7MQHfKDXdHHci0qFj3aGIhHBSOsxBfGudFu7jhvXRzVBK284dD7rr0tuveFjtBEMxDqVwDOBiSJM7SytpXGJrY2i3wlZBZAZCxlV4GzbwXtuGfmlkhD6xituWUHLu64saY8rIZAm6FSqZC9YRqRlcJwMIPTus5gZDZD';

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/webhook', function(req,res){
   if (req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');    
  } 
});

app.post('/webhook', function(req, res) {
    //res.send('Webhook POST working');
    //var msg = JSON.parse(req);
    //console.log(msg.entry.messaging.message.text);
    console.log(req.body.entry.messaging.message.text);
    //console.log("Testing");
    //postRequest();
});

app.post('/post', function(req, res) {
    res.send(req.body.entry[0].messaging[0].message.text);
});

app.get('/get', function(req, res) {
    res.send('Test GET working');
});

function postRequest() {
    var postAddress = 'https://graph.facebook.com/v2.6/me/messages?access_token=' + token;
    request.post(
        postAddress,
    { "recipient": 
        { "phone_number": "+1(734)249-0075" },
     "message":
        { "text": "YOOO"}
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);
}