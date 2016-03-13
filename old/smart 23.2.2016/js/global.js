var pool  = mysql.createPool({
	connectionLimit : 3,
	host     : 'localhost',
	user     : 'smart',
	password : '',
	port     : 8889,
	database : 'smart',
	multipleStatements : true,
	timezone: 'utc'
});

//  var pool  = mysql.createPool({
//  	connectionLimit : 3,
//  	host     : '212.199.178.35',
//  	user     : 'nodejsy78ay',
//  	password : 'jklAD78DJHKfr7h3w',
//  	port     : 3306,
//  	database : 'dbase1db',
//  	multipleStatements : true,
//  	timezone: 'utc'
//  });
  
//  var pool  = mysql.createPool({
//  	connectionLimit : 3,
//  	host     : 'smarter.cdrjpmw5kyce.us-west-2.rds.amazonaws.com',
//  	user     : 'zloof',
//  	password : 'ThePirates8462951',
//  	port     : '3306',
//  	database : 'smarter',
//  	multipleStatements : true,
//  	timezone: 'utc'
//  });

/*var pool1  = mysql.createPool({
    connectionLimit : 3,
    host     : '212.199.178.35',
    user     : 'nodejsy78ay',
    password : 'jklAD78DJHKfr7h3w',
    port     : 3306,
    database : 'chat',
    multipleStatements : true,
    timezone: 'utc'
});*/

var sql = "select 1 as DbIsWorking;";
// var sql = "select * from usersSession;";
pool.query(sql,function(err,result){
	console.log(result);
});

var sql = "select 1 as chatDbIsWorking;";
// var sql = "select * from usersSession;";
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

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

Date.prototype.addMinutes = function(m){
    this.setMinutes(this.getMinutes() + m);
    return this;
}

Date.prototype.addSeconds = function(s){
    this.setSeconds(this.getSeconds() + s);
    return this;
}

function getBuildingsJson(vtype){
	if(vtype==0){
		return json_mainBuilding;
	}
	else if(vtype==1){
		return json_residential;
	}
	else if(vtype==2){
		return json_restaurant;
	}
	else if(vtype==3){
		return json_foodFactory;
	}
	else if(vtype==4){
		return json_corporate;
	}
	else if(vtype==5){
		return json_accountant;
	}
	else if(vtype==6){
		return json_clothingStore;
	}
	else if(vtype==7){
		return json_clothingFactory;
	}
}