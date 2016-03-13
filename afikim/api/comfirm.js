var comfirm = new comfirmJs();
function comfirmJs(){
	function ctor(){
		var apiName = req.originalUrl;
		apiName = apiName.split("/")[3];
		
		if(apiName == "updateComfirm"){
			updateComfirm()
		}
		else if(apiName == "showComfirm"){
			showComfirm()
		}
		else if(apiName == "doComfirm"){
			doComfirm();
		}
		else{
			res.send(apiName);
		}
		
	}
	this.ctor = ctor;
	
	function doComfirm(){
		var connection = createConnection();
		
		var session = (req.headers.cookie.split("=")[1]);
		var sql = "SELECT id FROM session WHERE vsession ='" + session + "';";
		
		connection.query(sql,function(err,result){
			var id = (result[0]['id'])
			var sql = "UPDATE users set firstTime=1 WHERE id =" + id + ";";
			connection.query(sql);
			
			res.send(session);
			connection.end();	
		})
	}
	function updateComfirm(){
		var text = req.query.text;
		var connection = createConnection();
		
		var sql = "UPDATE comfirm SET text='" + text + "' WHERE id=1;";

		connection.query(sql,function(err,result){
			res.send(result);
			connection.end();	
		})
	}
	
	function showComfirm(){
		var connection = createConnection();
		
		var sql = "SELECT * FROM comfirm WHERE id=1";

		connection.query(sql,function(err,result){
			res.send(result);
			connection.end();	
		})
	}
}