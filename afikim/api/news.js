var news = new newsJs()
function newsJs(){
	function ctor(){
		var url = req.url.split('/')[3];
		
		if(url=='addNews'){
			addNews();
		}
		else if(url=='deleteNews'){
			deleteNews()
		} 
		else if(url=='showNews'){
			showNews()
		}
		else{
			res.send(url);
		}
	}
	this.ctor = ctor;
	
	function showNews(){
		var connection = createConnection();
		var sql = 'SELECT * FROM news;';
		
		connection.query(sql,function(err,result){
			res.send(result);
			connection.end()
		})
	}
	function addNews(){
		var text = req.query.text;
		
		var connection = createConnection();
		var sql = 'INSERT INTO news(bigText) value("' + text + '");';
		
		connection.query(sql,function(err,result){
			connection.end()
			res.send('success');
		})
	}
	function deleteNews(){
		var id = req.query.id;
		
		var connection = createConnection();

		var sql = 'DELETE FROM news WHERE id=' + id + ';';
		connection.query(sql,function(err,result){
			connection.end();
			res.send('success');
		})	
	}
}
	
