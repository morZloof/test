var header = new headerJs()
function headerJs(){
	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];
		
		if(url == "notifications")
		{
			notifications(res,req,id);
		}
		else if(url == "getPetek"){
			getPetek(res,req,id);
		}
		else if(url == "search"){
			search(res,req,id);
		}
		else if(url=='readNotifications'){
			readNotifications(res,req,id);
		}
		else{
			res.send(url);
		}
	}
	this.ctor = ctor;

	function readNotifications(res,req,id){
		var notification_id = req.query.notification_id;

		var sql = 'UPDATE notification SET '
					+ 'vread=1 '
				+ 'WHERE id=' + notification_id + ';'

		pool.query(sql);
		res.send('success');
	}
	//url: http://localhost:3000/api/header/getPetek/
	function getPetek(res,req,id){
		var url = '/www/pages/petek/mishpatim.json';
		
  		res.sendFile(__dirname + url);
	}
	
	// url: http://212.199.178.35/api/header/notifications/?session=e0bd23fe-a174-f4d5-0f33-439f82a988d1
	function notifications(res,req,id){
        
        var sql = 'SELECT * '
                + 'FROM notification '
                + 'WHERE users_id=' + id +' ORDER BY id DESC LIMIT 15;';
        
        pool.query(sql,function(err,result){
            res.send(result);
        })
	}

	function search(res, req, id) {
		
		var searchQuery = req.query.searchQuery;
		
		var sql = "SELECT * "
				+ "FROM users  "
				+ "WHERE users.userName like '" + searchQuery + "%' LIMIT 30; " 
				+ "SELECT * "
				+ "FROM companys "
				+ "WHERE companys.name like '" + searchQuery + "%' LIMIT 30; "
		
		pool.query(sql, function(err, result) {
			res.send(result);
		});
	}
}