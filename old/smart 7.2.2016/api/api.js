function api(res,req){
	var url = req.originalUrl.split('/')[2];
	var checkLogin  = req.originalUrl.split('/')[2];
	checkLogin  += "/" + req.originalUrl.split('/')[3];

	if(checkLogin=="users/login"){
		users.ctor(res,req,null);
	}
	else if(checkLogin == "users/register"){
		users.ctor(res,req,null);
	}
	else if(checkLogin == "users/registerCheck"){
		users.registerCheck(res,req,null);
	}
	else if(checkLogin == "users/comfirmRegister"){
		users.comfirmRegister(res,req,null);
	}
	else if(checkLogin == "users/changeMail"){
		users.ctor(res,req,null);
	}
	else{
		var session = req.query.session;

		validateSession(session,function(id){
			if(id=="badSession"){
				res.send('-1');
			}
			else if(url=="buy"){
				buy.ctor(res,req,id)
			}
			else if(url=="rank"){
				rank.ctor(res,req,id)
			}
			else if(url=="users"){
				users.ctor(res,req,id);
			}
			else if(url=='mapUser'){
				buy.ctor(res,req,id);
			}
			else if(url=='map'){
				map.ctor(res,req,id);
			}
			else if(url=='company'){
				company.ctor(res,req,id);
			}
			else if(url=='feed'){
				feed.ctor(res,req,id);
			}
			else if(url=='header'){
				header.ctor(res,req,id);
			}
			else if(url=='reputation'){
				reputation.ctor(res,req,id);
			}
			else if(url=='mentor'){
				mentor.ctor(res,req,id);
			}
			else if(url=='war'){
				war.ctor(res,req,id);
			}
			else{
				res.send("error in app.js");
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
		// session = (req.headers.cookie.split("=")[1]);
		var sql = "SELECT * FROM usersSession WHERE session='" + session + "' LIMIT 1;"
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
