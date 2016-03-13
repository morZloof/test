var runningTime = new runningTimeJs()
function runningTimeJs(){
    function ctor(res, req, id) {
		var url = req.originalUrl.split('/')[3];

		if(url == "getBonus"){
			getBonus(res, req, id);
		}
		else {
			res.send("error");
		}
	}
	this.ctor = ctor;
    
    function getBonus(res,req,id){
        var sql = 'SELECT * FROM bonus WHERE users_id=' + id + ' AND dateEnd<now();'
        res.sed('a')
        pool.query(sql,function(err,result){
            
            if(result[0]==undefined){
                res.send('-10');
                return;
            }
            else{
                var bonus = result[0].bonus;
            }
            
            if(bonus==1){
                var nowTime = new Date()
                nowTime = nowTime.addHours(5);
                var endTime = formatDate(nowTime);
                        
                var sql = 'UPDATE users SET '
                        + 'money=money+ ' + 150000 + ', '
                        + 'reputation=reputation+ ' + 10 + ' '
                        + 'WHERE id=' + id + '; '
                        
                        + 'DELETE FROM bonus '
                        + 'WHERE users_id=' + id +' LIMIT 1; '
                        
                        + 'INSERT INTO bonus '
                            + '(users_id,bonus,dateEnd) '
                        + 'VALUES '
                            + '('+ id + ',2,"' + endTime +'"); '
                        
                pool.query(sql);
                res.send('success');
            }
            else if(bonus==2){
                var nowTime = new Date()
                nowTime = nowTime.addHours(12);
                var endTime = formatDate(nowTime);
                
                var sql = 'UPDATE users SET '
                        + 'money=money+ ' + 300000 + ', '
                        + 'reputation=reputation+ ' + 25 + ' '
                        + 'WHERE id=' + id + '; '
                        
                        + 'DELETE FROM bonus '
                        + 'WHERE users_id=' + id +' LIMIT 1; '
                        
                        + 'INSERT INTO bonus '
                            + '(users_id,bonus,dateEnd) '
                        + 'VALUES '
                            + '('+ id + ',3,"' + endTime +'");'
                
                pool.query(sql);
                res.send('success');
            }
            else if(bonus==3){
                var nowTime = new Date()
                nowTime = nowTime.addHours(24);
                var endTime = formatDate(nowTime);
                
                var sql = 'UPDATE users SET '
                        + 'money=money+ ' + 400000 + ', '
                        + 'reputation=reputation+ ' + 25 + ' '
                        + 'WHERE id=' + id + '; '
                        
                        + 'DELETE FROM bonus '
                        + 'WHERE users_id=' + id +' LIMIT 1; '
                        
                        + 'INSERT INTO bonus '
                            + '(users_id,bonus,dateEnd) '
                        + 'VALUES '
                            + '('+ id + ',4,"' + endTime +'");'
                
                pool.query(sql);
                res.send('success');
            }
            else if(bonus==4){
                var sql = 'UPDATE users SET '
                        + 'money=money+ ' + 600000 + ', '
                        + 'reputation=reputation+ ' + 70 + ' '
                        + 'WHERE id=' + id + '; '
                        
                        + 'DELETE FROM bonus '
                        + 'WHERE users_id=' + id +' LIMIT 1; '
                        
                pool.query(sql);
                res.send('success');
            }
            else{
                res.send('-10');
            }
        })
    }
}