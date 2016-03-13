// var pool  = mysql.createPool({
// 	connectionLimit : 3,
// 	host     : 'localhost',
// 	user     : 'smart',
// 	password : '',
// 	port     : 8889,
// 	database : 'chat',
// 	multipleStatements : true,
// 	timezone: 'utc'
// });

var pool  = mysql.createPool({
    connectionLimit : 3,
    host     : '212.199.178.35',
    user     : 'nodejsy78ay',
    password : 'jklAD78DJHKfr7h3w',
    port     : 3306,
    database : 'chat',
    multipleStatements : true,
    timezone: 'utc'
});

var sql = "select 1 as DbIsWorking;";
// var sql = "select * from usersSession;";
pool.query(sql,function(err,result){
	console.log(result);
});