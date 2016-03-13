var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'ofek1',
  password : '',
  port     : 8889,
  database : 'ofek',
  multipleStatements : true
});

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'nodejs7Aujh',
//   password : 'kljDA7KJLrw7uhDjmq',
//   port     : 3306,
//   database : 'dbase1db',
//   multipleStatements : true
// });

function doLogin(email,password,callback){
	var sql = 'SELECT * FROM users WHERE email="' + email + '" AND password="' + password +'";';
  
	connection.query(sql, function(err, result) {
		if(result.length>0){
			var session = createNewSession();

      var userId = result[0]['id']
			updateSession(userId,session);
      callback(session);
		}
    else{
      callback("-1");
    }
	});
}
module.exports.doLogin = doLogin;

function checkUser(req,res,callback){
  var session = req.headers.cookie.split("session=")[1]

	var sql = 'SELECT * FROM users WHERE id IN'+
  '(SELECT id FROM session WHERE vsession="' + session + '");';

  connection.query(sql, function(err, result) {
		callback(result);
	});
  
}
module.exports.checkUser = checkUser;

function checkSession(session,callback){
  var sql = 'SELECT * FROM session WHERE vsession="' + session + '";';
  
	connection.query(sql, function(err, result) {
		if(result.length>0){
      callback(true);
    }
    else{
      callback(false);
    }
	});
}
module.exports.checkSession = checkSession;

function myUser(session,callback){
  var sql = "SELECT * FROM users WHERE id IN"+
            " (SELECT id FROM session WHERE vsession = '" + session + "');";
  connection.query(sql,function(err,result){
    callback(result);
  })
}
module.exports.myUser = myUser;

function deleteUser(id,callback){
  var sql = 'DELETE FROM users WHERE id=' + id + ';' 
	connection.query(sql,function(err,result){
    var sql = 'SELECT * FROM users;';
  	connection.query(sql,function(err,result){
      callback(result);
      // connection.end();
    });
  });
}
module.exports.deleteUser = deleteUser;

function showUsers(callback){
  var sql = "SELECT * FROM users";
  connection.query(sql, function(err, result) {
		callback(result);
	});
}
module.exports.showUsers = showUsers;

function createUser(name,L_name,email,password,adminNum,district,school,vclass,callback){
  var sql = 'SELECT count(*) as numbers FROM users WHERE email="' + email + '"';
	connection.query(sql,function(err, result) {
    if(result[0]['numbers']>0){
      callback("-2");
    }
    else{
      var sql = 'INSERT INTO users'+
              '(name,L_name,email,password,admin,district,school,class,firstTime) values'+
              '("' + name + '","' + L_name + '","' + email + '","' + password + '",' + adminNum + ',"' + district + '","' + school + '","' + vclass + '",0);'+ 
              'SELECT id FROM users WHERE email="' + email + '";';
    	connection.query(sql,function(err,result){
        var id =result[1][0]['id'];
        var sql = 'INSERT INTO session (id) value ("' + id + '");'
        connection.query(sql);
      });
      showUsers(function(result){
        callback(result);
      })
    }
	});
}
module.exports.createUser = createUser;

function editUser(theId,L_name,name,email,password,adminNum,district,school,vclass,callback){
  var sql = 'SELECT count(*) as numbers FROM users WHERE email="' + email + '" and id!=' + theId + '';
	connection.query(sql,function(err, result) {
    if(result[0]['numbers']>0){
      callback("-2");
    }
    else{
      var sql = 'UPDATE users SET ' +
                'name = "' + name + '", ' +
                'L_name = "' + L_name + '", ' +
                'email = "' + email + '", ' +
                'password = "' + password + '", ' +
                'district = "' + district + '", ' +
                'school = "' + school + '", ' +
                'class = "' + vclass + '", ' +
                'admin = "' + adminNum + '" ' +
              ' WHERE id = ' + theId + ';'
    	connection.query(sql);
      
      showUsers(function(result){
        callback(result);
      })
    }
	});
}
module.exports.editUser = editUser;

function createNewSession() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function updateSession(id,session){
  var sql = 'SELECT count(*) AS counter FROM session WHERE id=' + id + ';';
  connection.query(sql,function(err,result){
    if(result[0]['counter']==1){
      var sql = 'UPDATE session SET vsession="' + session + '" WHERE id=' + id + ';';
      connection.query(sql);    
    }
    else{
      var sql = 'INSERT INTO session (id,vsession) VALUES (' + id + ',"' + session + '");';
      connection.query(sql); 
    }
  })  
  
	
}

