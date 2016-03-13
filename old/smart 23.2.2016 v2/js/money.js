var money = new moneyJs();
function moneyJs(){
	ctor()
	function ctor(){
		// updateUserBuildings(1);
		//updateUser(1);
	}
	
	function updateUser(id){
		var sql = 'SELECT * FROM usersBuildings WHERE users_id=' + id;
		
		pool.query(sql,function(err,result){
			
			var loopLength = result.length;
			
			var sql = "";
			for(var i=0; i<loopLength ;i++)
			{
				var buildingId = result[i].id
				var vtype = result[i].type_id;
				var level = result[i].level;
				var json = getBuildingsJson(vtype);
				var profit = json.levels[level-1].profit;
				
				sql += 'UPDATE usersBuildings SET '
							+ 'profit = ' + profit + ' '
						+ 'WHERE id = ' + buildingId + '; ';
				// console.log(level)
			}
			
			pool.query(sql,function(err,result){
				updateUserProfit(id);
			});
		})
	}
	this.updateUser = updateUser;
	
	function updateUserProfit(id){
		var sql = 'SELECT SUM(profit) AS profit FROM usersBuildings WHERE users_id=' + id;

		pool.query(sql,function(err,result){
			var profit = result[0].profit;
			
			var sql = 'UPDATE users SET '
						+ 'profit= ' + profit + ' '
					+ 'WHERE id=' + id
					
			pool.query(sql);
		})
	}	
	this.updateUserProfit = updateUserProfit;
}