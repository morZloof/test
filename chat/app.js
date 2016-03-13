var app = require('express')();
var http = require('http'),
    fs = require('fs');
var http = http.Server(app);
var io = require('socket.io')(http);

http.listen(80, function(){
  console.log('listening on *:3000');
});

var mysql = require('mysql');
var async = require('async');
var sha256 = require('sha256');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

// Put a friendly message on the terminal

app.get('/api/*', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    api(res,req);
});
 
// main js
eval(fs.readFileSync(__dirname + '/js/global.js')+'');
eval(fs.readFileSync(__dirname + '/api/api.js')+'');
eval(fs.readFileSync(__dirname + '/api/masseges.js')+'');
eval(fs.readFileSync(__dirname + '/api/chat.js')+'');

// console.log('Server running at http://127.0.0.1:' + port + '/');
