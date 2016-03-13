var diamonds = new diamondsJs();
function diamondsJs(){
	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];

		if(url == "buy"){
			buy(res,req,id);
		}
		else{
			res.send("error");
		}
	}
	this.ctor = ctor;
	//get: money
	function buy(res,req,id){
		var sql = "UPDATE users SET diamonds=diamonds+10 WHERE id=" + id +";";
		
		pool.query(sql,function(err,result){
			res.send(result);
		}) 
	}
}