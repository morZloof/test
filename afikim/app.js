var server=0;

var express = require('express');
var http = require('http');
var mkdirp = require('mkdirp');
var fs = require('fs'),
    path = require('path');
var app = express();
var mysql = require('mysql');

if(server==0){
    var server = http.createServer(app).listen(3000);  
}
else{
    
// var server = http.createServer(app).listen(80);  
}

var io  = require('socket.io')(server),
    dl  = require('delivery'),
    fs  = require('fs');
   
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/www/index.html');  
});

app.get('/www/*', function(req, res) {  
  var url = req.originalUrl;
  url = url.split("?")[0];
  
  res.sendFile(__dirname + url);
});


app.get('/comfirm/comfirm.html', function(req, res) {
  res.sendFile(__dirname + '/comfirm/comfirm.html');
});

app.get('/files/*', function(req, res) {  
  var url = req.originalUrl;
  url = url.split("/")[2];
  var id = req.query.id;
  var place = req.query.place;
  var fileId = url.split("_")[0];

  // res.sendfile("/files/" + url, {root: __dirname });
  console.log(__dirname + "/files/" + url)
  fs.exists(__dirname + "/files/" + url, function(exists) {
    if (exists) {
      res.sendfile("/files/" + encodeURIComponent(url), {root: __dirname });
    } 
    else {
      var path = "/files/" + decodeURIComponent(url);
      path = path.split(/_(.+)?/)[1]
    
      res.sendfile("/files/" + path, {root: __dirname });
    }
  });
  
  // var connection = createConnection();
  // var sql = "UPDATE files SET view"+ place +" = view"+ place +"+1 WHERE id=" + fileId +";"
  
  // connection.query(sql,function(err,result){
  //   	connection.end()
  // });
  
});

app.get('/api/*', function(req, res) {  
  var url = req.originalUrl;
  api(res,req,url);
});

io.sockets.on('connection', function(socket){
  var delivery = dl.listen(socket);
  delivery.on('receive.success',function(file){
    fs.writeFile(__dirname + "/files/"+ encodeURIComponent(file.name) ,file.buffer, function(err){
      if(err){
        // console.log('File could not be saved.');
      }else{
        // cahgenFileName(file.name)
        // console.log('File saved.');
      };
    });
  });
});

// function cahgenFileName(path){
//   var connection = createConnection();
//   path = decodeURIComponent(path);

//   var sql = 'SELECT * FROM files WHERE filePath1="' + path + '" LIMIT 1;';

//   connection.query(sql,function(err,result){
//    path = encodeURIComponent(path);
//    if(result.length>0){
//       var tempId = (result[0]['id']);
//       var change = (result[0]['change1']);
//       if(change==0){
//         var newName = tempId + "_" + path;
//         var sql = 'UPDATE files SET filePath1="' + newName + '", change1=1 WHERE filePath1="' + path + '" LIMIT 1;';
//         connection.query(sql);
        
//         fs.rename(__dirname + '/files/' + path, __dirname + '/files/' + newName, function (err) {
         
//         });
//       }
//     }
    
//   });
// }
function createConnection(){
//   var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'nodejs7Aujh',
//     password : 'kljDA7KJLrw7uhDjmq',
//     port     : 3306,
//     database : 'dbase1db',
//     multipleStatements : true
//   });

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'ofek1',
    password : '',
    port     : 8889,
    database : 'ofek',
    multipleStatements : true
  });
  
  return connection;
}

eval(fs.readFileSync('api.js')+'');

// console.log('Server running at http://127.0.0.1:1337/');