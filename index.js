// test server

var http = require('http'),
    express = require('express'),
    path = require('path'),
    connect = require("connect"),
    Client = require('node-rest-client').Client,
    _ = require('lodash');

var rally = require('rally'),
    restApi = rally({
        user: '********', //required if no api key, defaults to process.env.RALLY_USERNAME
        pass: '********', //required if no api key, defaults to process.env.RALLY_PASSWORD
        // apiKey: '_12fj83fjk...', //preferred, required if no user/pass, defaults to process.env.RALLY_API_KEY
        // apiVersion: 'v2.0', //this is the default and may be omitted
        server: 'https://rally1.rallydev.com',  //this is the default and may be omitted
        requestOptions: {
            headers: {
                'X-RallyIntegrationName': 'Rally Webhook Example',  //while optional, it is good practice to
                'X-RallyIntegrationVendor': 'Barry Mullan',             //provide this header information
                'X-RallyIntegrationVersion': '1.0'                    
            }
            //any additional request options (proxy options, timeouts, etc.)     
        }
    }),
    refUtils = rally.util.ref;

var log4js = require('log4js');
log4js.configure({
  appenders: [
    // { type: 'console' },
    { type: 'file', filename: 'logs.log' }
  ]
});

var logger = log4js.getLogger();
logger.setLevel(log4js.levels.DEBUG);
logger.warn("Some debug messages");

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

// app.get('/:collection', function(req, res) { //A
//    var params = req.params; //B
//    console.log(req.params.collection);
//    res.send(200,JSON.parse(req.body));
// });

app.post('/:collection', function(req, res) { //A
   var params = req.params; //B
   console.log(req.params.collection);

	if ( req.params.collection==="update") {
		logger.warn("update");
		logger.warn(req.body);
		var obj = req.body; // JSON.parse(req.body);
		var name = obj["message"]["state"]["500a0d67-9c48-4145-920c-821033e4a832"]["value"];
		var objectID = obj["message"]["state"]["06841c63-ebce-4b6f-a2fc-8fd4ed0776ce"]["value"];
		var ref = "/defect/"+objectID;
		console.log("Name:",name,"ObjectID:",objectID,"Ref:",ref);

		restApi.update ( {
			ref : ref,
			data : {
				ScheduleState : "Accepted"
			},
			fetch : ["FormattedID","Name"],
		},
		function( error, result) {
			if (error) {
				console.log("Error:",error);
			} else {
				console.log(JSON.stringify(result.Object));
			}
		}
		);
   	}

   res.send(200,(req.body.length));
});

// app.use(function (req,res) {
//     res.render('404', {url:req.url});
// });
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// curl -H "Content-Type: application/json" -X POST --data-binary @sample.json  http://localhost:3000/update


function updateDefect(result) {
    console.log('Updating defect...');
    restApi.update({
        ref: result.Object,
        data: {
            Name: 'My Updated Defect'
        },
        fetch: ['Name']
    }, function(error, result) {
        if(error) {
            onError(error);
        } else {
            console.log('Defect updated:', result.Object.Name);
            deleteDefect(result);
        }
    });
}


