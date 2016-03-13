function api(res,req){
	var url = req.originalUrl.split('/')[2];
	var checkLogin  = req.originalUrl.split('/')[2];
	checkLogin  += "/" + req.originalUrl.split('/')[3];

	if(checkLogin=="users/login"){
		try {
			users.ctor(res,req,null);
		}
		catch(e){
			console.log(1)
		}
	}
	else if(checkLogin == "users/register"){
		try {
			users.ctor(res,req,null);
		}
		catch(e){
			console.log(1)
		}
	}
	else if(checkLogin == "users/registerFirstSide"){
		try {
			users.ctor(res,req,null);
		}
		catch(e){
			console.log(1)
		}
	}
	else if(checkLogin == "users/registerSecondSide"){
		try {
			users.ctor(res,req,null);
		}
		catch(e){
			console.log(1)
		}
	}
	else if(checkLogin == 'users/checkDisputePass'){
		try {
			users.ctor(res,req,null);
		}
		catch(e){
			console.log(1)
		}
	}
	else if(checkLogin == "deleteDispute/deleteDis"){
		try {
			deleteDispute.deleteDis(res,req,null);
		}
		catch(e){
			console.log(1)
		}
	}
	else if(checkLogin == "users/mediatorRegister"){
		try {

			users.mediatorRegister(res,req,null);
		}
		catch(e){
			console.log(1)
		}
	}
	else if(checkLogin == "allDispute/getAllDispute"){
		try {
			allDispute.getAllDispute(res,req,null);
		}
		catch(e){
			console.log(1)
		}
	}
	// else if(checkLogin == "allDispute/getFav"){
	// 	try {
	// 		allDispute.getFav(res,req,null);
	// 	}
	// 	catch(e){
	// 		console.log(1)
	// 	}
	// }
    else if(checkLogin == "allDispute/getAllDisputeVotes"){
		try {
			allDispute.getAllDisputeVotes(res,req,null);
		}
		catch(e){
			console.log('error')
		}
	}
    else if(checkLogin == "allDispute/getAllDisputeHot"){
		try {
			allDispute.getAllDisputeHot(res,req,null);
		}
		catch(e){
			console.log('error')
		}
	}
    else if(checkLogin == "allDispute/getAllDisputeBrainstorm"){
		try {
			allDispute.getAllDisputeBrainstorm(res,req,null);
		}
		catch(e){
			console.log('error')
		}
	}
    else if(checkLogin == "allDispute/getTag"){
		try {
			allDispute.getTag(res,req,null);
		}
		catch(e){
			console.log('error')
		}
	}
	else{

		var session = req.query.session;

		validateSession(session,function(id){

			try {
				if(id=="badSession"){
					res.send("-1");
				}
				else{
					if(url == 'users'){
						users.ctor(res,req,id);
					}
					else if(url == "mentor"){
						mentor.ctor(res,req,id);
					}
					else if(url == 'dispute'){
						dispute.ctor(res,req,id);
					}
					else if(url == 'allDispute'){
						allDispute.ctor(res,req,id);
					}
					else if(url == 'notification'){
						notification.ctor(res,req,id);
					}
					else{
						res.send("error in api.js");
					}
				}
			}
			catch(e){
				console.log(1)
			}
		})
	}
	
	function validateSession(session,callback){
		// var session = (req.headers.cookie);

		if(session==undefined){
			callback("badSession");
		}
		else{
			// session = (req.headers.cookie.split("=")[1]);
			var sql = "SELECT * FROM usersSession WHERE session='" + session + "';"
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
}
