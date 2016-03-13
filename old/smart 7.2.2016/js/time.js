var time = new timeJs()
function timeJs(){

	ctor();
	function ctor(){
		check()
		setInterval(check,2000);
	}

	function check(){

		var sql= 'SELECT * FROM buildingsTime WHERE dateEnd<NOW(); '
		+ 'UPDATE usersBuildings SET inBuild=0, isUpdate=0 WHERE id IN '
		+ '(SELECT usersBuildings_id FROM buildingsTime WHERE dateEnd<NOW()); '
		+ 'DELETE FROM buildingsTime WHERE dateEnd<NOW()';

		pool.query(sql,function(err,result){
			var json = result[0];
			var loopLength = json.length;

			for(var i=0; i<loopLength ;i++){
				var users_id = (json[i].users_id);
				// updateUser(users_id);
			}
		})
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
				var level = result[i].level-1;
				var json = getBuildingsJson(vtype);
				var profit = json.levels[level].profit;

				sql += 'UPDATE usersBuildings SET '
							+ 'profit = ' + profit + ' '
						+ 'WHERE id = ' + buildingId + '; '
			}

			sql += 'UPDATE users SET '
					+ 'profit = (SELECT SUM(profit) AS profit FROM usersBuildings WHERE users_id=' + id + ' AND inBuild=0) '
				+ 'WHERE id =' + id

			pool.query(sql)
		})
	}

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
}