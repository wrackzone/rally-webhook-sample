// test server

var http = require('http'),
    express = require('express'),
    path = require('path'),
    connect = require("connect"),
    Client = require('node-rest-client').Client,
    _ = require('lodash'),


client = new Client();

// comment

var app = express();
app.set('port', process.env.PORT || 3000); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

console.log("Running");

app.use(connect.json());
app.use(express.static(path.join(__dirname, 'public')));
	 
app.get('/', function (req, res) {
  res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/:collection', function(req, res) { //A
   var params = req.params; //B
   console.log(req.params.collection);
   res.send(200,JSON.parse(req.body));
});

app.post('/:collection', function(req, res) { //A
   var params = req.params; //B
   console.log(req.params.collection);
   res.send(200,(req.body));
});

// app.use(function (req,res) {
//     res.render('404', {url:req.url});
// });
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// curl -H "Content-Type: application/json" -X POST -d ' { "fullName":"wrackzone/psi-feature-burnup", "data":[]}' http://localhost:3000/update



