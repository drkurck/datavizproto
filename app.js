var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser'); 
var logger = require('morgan');
var session = require('express-session');
var multer = require('multer');


var app = express()

var file = 'traces.json'

var text = fs.readFileSync('traces.json','utf8')
data = text.split(/\r\n/)

var post = new Array();
var order = new Array();
var linecart = new Array();
var production = new Array();
var product = new Array();

data.forEach(function(line, index) {
    if (line.length > 0) {
        line = JSON.parse(line)
        
        switch (line.model_to_join) {
            case 'Post':
                post.push(line)
                break;
            case 'Dbc_Order':
                order.push(line)
                break;
            case 'Dbc_Linecart':
                linecart.push(line)
                break;
            case 'Dbc_Production':
                linecart.push(line)
                break;
            case 'Fixedproduct':
                linecart.push(line)
                break;
            default:
                
        }
    }
});

console.log(order.length);
order.forEach(function(data, index) {
    for (var i = 0; i < data.newObject.Dbc_Linecart.length; i++) {
        console.log('------------------');
        console.log(data.newObject.Dbc_Linecart[i].Fixedproduct.name);
        console.log(data.newObject.Dbc_Linecart[i].Fixedproduct.quantity);
    }
}) 

// some environment variables
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(session({ resave: true, saveUninitialized: true, secret: 'uwotm8' }));
// parse application/json
app.use(bodyParser.json());                        

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse multipart/form-data
// app.use(multer());

app.use(express.static(path.join(__dirname, 'public')));

// dynamically include routes (Controller)
fs.readdirSync('./controller').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controller/' + file);
      route.controller(app);
  }
});

var server = http.createServer (app);

server.listen(app.get('port'), function(){
   console.log('Express server on port ' + app.get('port'));
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))