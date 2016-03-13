function api(res,req){
	
    var url = req.originalUrl.split('/')[2];
	var checkLogin = req.originalUrl.split('/')[2];
	// checkLogin  += "/" + req.originalUrl.split('/')[3];

	if(checkLogin=="users/login"){
		users.ctor(res,req,null);
	}
	else{
		var session = req.query.session;

		validateSession(session,function(id){
			if(id=="badSession"){
				res.send('-2');
			}
			else if(url=='chat'){
				chat.ctor(res,req,id)
			}
			else{
				res.send("error in api.js");
			}
		})

	}
}
function validateSession(session,callback){
	// var session = (req.headers.cookie);

	if(session==undefined){
		callback("badSession");
	}
	else{
		var sql = "SELECT * FROM vusersSession WHERE session='" + session + "' LIMIT 1;"
		pool.query(sql,function(err,result){

			if((result[0]==undefined) ||(session.length<5)){
				callback("badSession");
			}
			else{
				callback(result[0]['id']);
			}
		})
	}
}
