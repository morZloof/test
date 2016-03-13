var rank = new rankJs()
function rankJs(){
	function ctor(res, req, id) {
		var url = req.originalUrl.split('/')[3];

		if(url == "getTopTen"){
			getTopTen(res, req, id);
		}
		else {
			res.send("error in rank.js");
		}
	}
	this.ctor = ctor;
	
	function getTopTen(res,req,id){
		
		var sql = 'SELECT * '
				+ 'FROM users '
				+ 'ORDER BY rank '
				+ 'limit 10; '
		
		pool.query(sql,function(err,result){
			res.send(result);	
		})
	}
}