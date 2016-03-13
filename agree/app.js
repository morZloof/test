var port = process.env.PORT || 3000,
// var port = process.env.PORT || 80,
    http = require('http'),
    fs = require('fs')

var app = require('express')();
var http = require('http');
var fs = require('fs'),
    path = require('path')

var mysql = require('mysql');
var async = require('async');
var sha256 = require('sha256');
var nodemailer = require('nodemailer');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

var server = http.createServer(app).listen(port);

app.get('/', function(req, res) {
  try {
    res.sendFile(__dirname + '/www/index.html');
  }
  catch(e){
    res.send("error");
  }
});

app.get('/www/*', function(req, res) {
  try {
    var url = req.originalUrl;
    res.sendFile(__dirname + url);
  }
  catch(e){
    res.send("error");
  }
});

app.get('/api/*', function(req, res) {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    var url = req.originalUrl;
    api(res,req);
  }
  catch(e){
    console.log()
  }
});
// main js
// eval(fs.readFileSync(__dirname + '/js/jquery2.1.4.js')+'');
eval(fs.readFileSync(__dirname + '/js/global.js')+'');
eval(fs.readFileSync(__dirname + '/api/api.js')+'');
// // all api
eval(fs.readFileSync(__dirname + '/api/users.js')+'');
eval(fs.readFileSync(__dirname + '/api/dispute.js')+'');
eval(fs.readFileSync(__dirname + '/api/mentor.js')+'');
eval(fs.readFileSync(__dirname + '/api/deleteDispute.js')+'');
eval(fs.readFileSync(__dirname + '/api/allDispute.js')+'');
eval(fs.readFileSync(__dirname + '/api/notification.js')+'');