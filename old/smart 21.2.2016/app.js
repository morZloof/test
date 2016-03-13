/* global ; */
var app = require('express')();
var cookieParser = require('cookie-parser')
app.use(cookieParser())

var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs');

var server = http.createServer();
app.listen(port);

var mysql = require('mysql');
var async = require('async');
var sha256 = require('sha256');
var nodemailer = require('nodemailer');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

//get
app.get('/', function(req, res) {
    var session = req.cookies.session;
    res.sendFile(__dirname + '/www/index.html');
});

app.get('/www/*', function(req, res) {
  var url = req.originalUrl;
  res.sendFile(__dirname + url);
});

app.get('/clientJs/*', function(req, res) {
  var url = req.originalUrl;
  res.sendFile(__dirname + url);
});

app.get('/json/*', function(req, res) {
  var url = req.originalUrl;
  res.sendFile(__dirname + url);
});

app.get('/cities/*', function(req, res) {
  var url = req.originalUrl;
  res.sendFile(__dirname + url);
});

app.get('/login/images/*', function(req, res) {
 var url = req.originalUrl;
 res.sendFile(__dirname + url);
});

var counterCampion = 1;
app.get('/register/*', function(req, res) {
  var url = req.originalUrl;
  url = url.split('?');

  if(url[1] != undefined){
    var campionId = req.query.campion;
    
    if(campionId==1){
      if(counterCampion==1){
        counterCampion=0;
        res.sendFile(__dirname + '/register/index.html');
      }
      else{
        counterCampion=1;
        res.sendFile(__dirname + '/register/index.html');
      }
    }
    else{
      res.sendFile(__dirname + url[0]);
    }
  }
  else{
    res.sendFile(__dirname + url[0]);
  }
});

// Put a friendly message on the terminal

app.get('/api/*', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  var url = req.originalUrl;
  api(res,req);
});

// json
eval(fs.readFileSync(__dirname + '/json/mainBuilding.js')+'');
eval(fs.readFileSync(__dirname + '/json/corporate.js')+'');
eval(fs.readFileSync(__dirname + '/json/restaurant.js')+'');
eval(fs.readFileSync(__dirname + '/json/residential.js')+'');
eval(fs.readFileSync(__dirname + '/json/foodFactory.js')+'');
eval(fs.readFileSync(__dirname + '/json/accountant.js')+'');
eval(fs.readFileSync(__dirname + '/json/clothingStore.js')+'');
eval(fs.readFileSync(__dirname + '/json/clothingFactory.js')+'');

// main js
eval(fs.readFileSync(__dirname + '/js/global.js')+'');
eval(fs.readFileSync(__dirname + '/js/time.js')+'');
// eval(fs.readFileSync(__dirname + '/js/chat.js')+'');
eval(fs.readFileSync(__dirname + '/js/money.js')+'');
eval(fs.readFileSync(__dirname + '/api/api.js')+'');

//clientJs
eval(fs.readFileSync(__dirname + '/clientJs/formulas.js')+'');

// all api
eval(fs.readFileSync(__dirname + '/api/header.js')+'');
eval(fs.readFileSync(__dirname + '/api/feed.js')+'');
eval(fs.readFileSync(__dirname + '/api/rank.js')+'');
eval(fs.readFileSync(__dirname + '/api/users.js')+'');
eval(fs.readFileSync(__dirname + '/api/buy.js')+'');
eval(fs.readFileSync(__dirname + '/api/map.js')+'');
eval(fs.readFileSync(__dirname + '/api/company.js')+'');
eval(fs.readFileSync(__dirname + '/api/reputation.js')+'');
eval(fs.readFileSync(__dirname + '/api/mentor.js')+'');
eval(fs.readFileSync(__dirname + '/api/war.js')+'');
eval(fs.readFileSync(__dirname + '/api/runningTime.js')+'');

eval(fs.readFileSync(__dirname + '/js/uglify.js')+'');

// console.log('Server running at http://127.0.0.1:' + port + '/');
