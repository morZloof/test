var feed = new feedJs();
function feedJs() {
	function ctor(res, req, id) {
		var url = req.originalUrl.split('/')[3];

		if(url == "addBigMessage"){
			addBigMessage(res, req, id);
		}
		else if(url == "getFeed") {
			getFeed(res, req, id);
		}
		else if(url == "addSmallMessage") {
			addSmallMessage(res, req, id);
		}
		else if(url == "doLike"){
			doLike(res,req,id);
		}
		else if(url == "deleteComment"){
			deleteComment(res,req,id);
		}
		else {
			res.send("error");
		}
	}
	this.ctor = ctor;
	
	function deleteComment(res,req,id){
		var msg_id = req.query.msg_id;
		

		async.waterfall([
			function(callback){
				var sql = 'SELECT *  '
				+ 'FROM users '
				+ 'WHERE id=' + id;
				
				pool.query(sql,function(err,result){
					var admin = result[0].admin;
					if(admin==2){
						callback(null)
					}
					else{
						res.send("-10: you not admin");
					}
				})	
				
			},function(callback){
				var sql = 'SELECT main_id,small_id '
					+ 'FROM feed '
				+ 'WHERE id=' + msg_id + ' LIMIT 1;'
			
				pool.query(sql,function(err,result){
					var main_id = result[0].main_id
					var small_id = result[0].small_id
					
					if(small_id==0){
						var sql = 'DELETE FROM feed WHERE main_id=' + main_id + ';'
					}
					else{
						var sql = 'DELETE FROM feed WHERE id=' + msg_id + ';'
					}
					
					pool.query(sql,function(err,result){
						getFeed(res,req,id);
					})
				})	
			}
		])
	}
	
	//GET: feed_id
	function doLike(res,req,id){
		var feed_id = req.query.feed_id;
		 
		var sql = 'SELECT count(*) AS paramCount '
				+ 'FROM feedLikes '
				+ 'WHERE feed_id=' + feed_id + ' AND users_id=' + id + '; '

		pool.query(sql,function(err,result){
			if(result[0]['paramCount'] == 0){
				var sql = 'INSERT INTO feedLikes '
					+ '(feed_id,users_id) '
				+ 'VALUES '
					+ '(' + feed_id + ',' + id + '); '
				
				+ 'UPDATE feed SET '
				 + 'likes = likes+1 '
				+ 'WHERE id=' + feed_id;
					
				pool.query(sql);
				res.send("success");
			}
			else{
				res.send("-10")
			}
		})
	}
	
	function addBigMessage(res, req, id) {
		var title = req.query.title;
		var text = req.query.text;
		var date = req.query.date;

		async.waterfall([
			function(callback){
				var sql = 'SELECT MAX(main_id) AS main_id '
						+ ' FROM feed '
						+ 'LIMIT 1';
				
				pool.query(sql,function(err,result){
					var main_id = result[0].main_id;
					callback(null,main_id);
				})
				
			},function(main_id,callback){
				var sql = 'INSERT INTO feed '
				+ '(users_id, main_id, num, title, text, date) '
					+ 'VALUES '
				+ '("' + id + '", ' + (main_id+1) + ', 0, "' + title + '","' + text + '", "' + date + '");';
				
				pool.query(sql, function(err, result) {
					res.send(result);
				});		
			}
		])
	}
	
	function getFeed(res,req,id){
		var sql = 'SELECT *,feed.id AS id '
				+ 'FROM feed '
				+ 'JOIN users ON users.id=feed.users_id '
				+ 'ORDER BY feed.main_id DESC, feed.small_id '
				+ 'LIMIT 50; '
				
				+ 'SELECT * '
				+ 'FROM feed '
				+ 'JOIN feedLikes ON feed.id=feedLikes.feed_id '
				+ 'ORDER BY feed.main_id DESC, feed.small_id '
				+ 'LIMIT 50; '
				
		pool.query(sql,function(err,result){
			res.send(result);
		})
	}
	
	function addSmallMessage(res,req,id){
		var messageId = req.query.id;
		var title = req.query.title;
		var text = req.query.text;
		var date = req.query.date;
		
		async.waterfall([
			function(callback){
				var sql = 'SELECT * '
						+ 'FROM feed '
						+ 'WHERE id=' + messageId + ' '
						+ 'LIMIT 1; '
						
						+ 'SELECT max(main_id) AS max_mainId '
						+ 'FROM feed '
						+ 'LIMIT 1; ';
						
				pool.query(sql,function(err,result){
					var main_id = result[0][0].main_id;
					var small_id = result[0][0].small_id;
					var num = result[0][0].num;
					var max_mainId = result[1][0].max_mainId
					
					callback(null,main_id,num,max_mainId,small_id);
				})
			},function(main_id,num,max_mainId,small_id,callback){

				var sql = 'UPDATE feed SET '
							+ 'small_id = 1 + small_id '
						+ 'WHERE main_id=' + max_mainId + ' AND small_id>' + small_id + ' ; '
						
						+ 'INSERT INTO feed '
						+ '(users_id, main_id,small_id, num, title, text, date) '
							+ 'VALUES '
						+ '("' + id + '", ' + main_id + ',' + (small_id + 1) + ', ' + (num+1) +', "' + title + '", "' + text + '", "' + date + '"); '
						
						+ 'UPDATE feed SET '
							+ 'main_id = 1 + ' + max_mainId + ', '
							+ 'comments = 1 + comments '
						+ 'WHERE main_id=' + max_mainId;

				pool.query(sql, function(err, result) {
					res.send("result");
				});		
			}
		])
	}	
}