var reputation = new reputationJs();
function reputationJs(){
	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];

		if(url == "insertReputation1"){
			insertReputation1(res,req,id);
		}
		else if(url == "insertReputation2"){
			insertReputation2(res,req,id);
		}
		else if(url == "insertReputation3"){
			insertReputation3(res,req,id);
		}
		else if(url == "insertReputation4"){
			insertReputation4(res,req,id);
		}
		else if(url == "insertReputation5"){
			insertReputation5(res,req,id);
		}
		else if(url == "finishBuildTime"){
			finishBuildTime(res,req,id);
		}
		else if(url == "buyOfficeLevel"){
			buyOfficeLevel(res,req,id);
		}
		else{
			res.send("error");
		}
	}
	this.ctor = ctor;
	
	// error: maximun office level
	// error: not enough reputation
	function buyOfficeLevel(res,req,id){
		var sql = 'SELECT * FROM users WHERE id = ' + id + ';';
		
		pool.query(sql,function(err,result){
			var officeLevel = result[0].officeLevel;
			var reputation = result[0].reputation;
			
			if(officeLevel==1 && reputation>250){
				var sql = 'UPDATE users SET '
								+ 'officeLevel=officeLevel+1, '
								+ 'reputation = reputation-250 '
						+ 'WHERE id=' + id + ';';

				pool.query(sql);
				res.send("success")
			}
			else if(officeLevel==2 && reputation>500){
				var sql = 'UPDATE users SET '
								+ 'officeLevel=officeLevel+1, '
								+ 'reputation = reputation-500 '
						+ 'WHERE id=' + id + ';';

				pool.query(sql);
				res.send("success")
			}
			else if(officeLevel==3 && reputation>1000){
				var sql = 'UPDATE users SET '
								+ 'officeLevel=officeLevel+1, '
								+ 'reputation = reputation-1000 '
						+ 'WHERE id=' + id + ';';

				pool.query(sql);
				res.send("success")
			}
			else if(officeLevel==4 && reputation>2000){
				var sql = 'UPDATE users SET '
								+ 'officeLevel=officeLevel+1, '
								+ 'reputation = reputation-2000 '
						+ 'WHERE id=' + id + ';';

				pool.query(sql);
				res.send("success")
			}
			else if(officeLevel==5){
				res.send("error: maximun office level")
			}
			else{
				res.send("error: not enough reputation")
			}
		})	
	}
	
	// get: usersBuildings_id
	// error: not enough reputation
	function finishBuildTime(res,req,id){
		var usersBuildings_id = req.query.usersBuildings_id;
		
		var sql = 'SELECT * FROM '
					+ 'buildingsTime '
				+ 'WHERE usersBuildings_id = ' + usersBuildings_id + '; '+ 
				'SELECT * FROM users WHERE id = ' + id;
		
		pool.query(sql,function(err,result){
			var myReputation = result[1][0].reputation;
			var endTime = new Date(result[0][0].dateEnd).getTime() / 1000;
			var nowTime = new Date(formatDate(new Date())).getTime() / 1000;
			
			var secondsLeft = endTime - nowTime;
			var reoutationCost = formulas.time(secondsLeft);

			if(myReputation<reoutationCost){
				res.send("error: not enough reputation");
			}
			else if(reoutationCost>0){
				var sql = 'UPDATE users SET'
								+ ' reputation = reputation-' + reoutationCost
						+ ' WHERE id = ' + id + '; '
						+ 'UPDATE usersBuildings SET '
							+ 'inBuild=0 '
						+ 'WHERE id=' + usersBuildings_id + '; '
						+ 'DELETE FROM buildingsTime '
						+ 'WHERE usersBuildings_id=' + usersBuildings_id + ';';

				pool.query(sql);
				res.send('success');
			}
			else{
				res.send('-10');
			}
		})
	}
	function insertReputation1(res,req,id){
		var sql = "UPDATE users SET reputation=reputation+500 WHERE id=" + id +";";
		
		pool.query(sql,function(err,result){
			
			res.send("success");
			
			var sql = 'INSERT usersPay'
					+ 	'(users_id,money,reputation)'
					+ 'VALUES'
					+ 	'(' + id +',"17.90",500)';
						
			pool.query(sql);
		}) 
	}
	function insertReputation2(res,req,id){
		var sql = "UPDATE users SET reputation=reputation+1200 WHERE id=" + id +";";
		
		pool.query(sql,function(err,result){
			
			res.send("success");
			
			var sql = 'INSERT usersPay'
					+ 	'(users_id,money,reputation)'
					+ 'VALUES'
					+ 	'(' + id +',"34.90",1200)';
						
			pool.query(sql);
		}) 
	}
	function insertReputation3(res,req,id){
		var sql = "UPDATE users SET reputation=reputation+2500 WHERE id=" + id +";";
		
		pool.query(sql,function(err,result){
			
			res.send("success");
			
			var sql = 'INSERT usersPay'
					+ 	'(users_id,money,reputation)'
					+ 'VALUES'
					+ 	'(' + id +',"69.90",2500)';
						
			pool.query(sql);
		}) 
	}
	function insertReputation4(res,req,id){
		var sql = "UPDATE users SET reputation=reputation+6500 WHERE id=" + id +";";
		
		pool.query(sql,function(err,result){
			
			res.send("success");
			
			var sql = 'INSERT usersPay'
					+ 	'(users_id,money,reputation)'
					+ 'VALUES'
					+ 	'(' + id +',"174.90",6500)';
						
			pool.query(sql);
		}) 
	}
	function insertReputation5(res,req,id){
		var sql = "UPDATE users SET reputation=reputation+14000 WHERE id=" + id +";";
		
		pool.query(sql,function(err,result){
			
			res.send("success");
			
			var sql = 'INSERT usersPay'
					+ 	'(users_id,money,reputation)'
					+ 'VALUES'
					+ 	'(' + id +',"349.90",14000)';
						
			pool.query(sql);
		}) 
	}
}