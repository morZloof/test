var pool  = mysql.createPool({
	connectionLimit : 3,
	host     : 'localhost',
	user     : 'agree',
	password : '',
	port     : 8889,
	database : 'agree',
	multipleStatements : true
});

//  var pool  = mysql.createPool({
//  	connectionLimit : 3,
//  	host     : 'localhost',
//  	user     : 'dbusrm',
//  	password : 'jDA78HJKAD7fhioDA7h',
//  	port     : 3306,
//  	database : 'cyticedb',
//  	multipleStatements : true
//  });

var sql = "SELECT 1 AS dbIsWorking;";
pool.query(sql,function(err,result){
	console.log(result);
});

function pad(num) {
	return ("0" + num).slice(-2);
}

function formatDate(d) {
	return [d.getUTCFullYear(), 
			pad(d.getUTCMonth() + 1), 
			pad(d.getUTCDate())].join("-") + " " + 
			[pad(d.getUTCHours()), 
			pad(d.getUTCMinutes()), 
			pad(d.getUTCSeconds())].join(":") + "";
}