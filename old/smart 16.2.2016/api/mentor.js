var mentor = new mentorJs()
function mentorJs(){
	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];

		if(url == "level1"){
			level1(res,req,id);
		}
		else if(url == "updateMentor"){
			updateMentor(res,req,id);
		}
		else if(url == "completeMission"){
			completeMission(res,req,id);
		}
		else{
			res.send("error in mentor.js");
		}
	}
	this.ctor = ctor;
	
	//GET: mession_id
	function completeMission(res,req,id){
		var mession_id = req.query.mession_id;
		var toComplete = req.query.toComplete;
        
		var sql = 'SELECT * FROM mentor WHERE users_id = ' + id;
		
		pool.query(sql,function(err,result){
			if(mession_id==1 && result[0].mession1==0){
				var sql = 'SELECT count(*) AS buildingsCount FROM usersBuildings WHERE users_id = ' + id + ' AND type_id=1';
				
				pool.query(sql,function(err,result){

					if(result[0].buildingsCount>2){
						res.send("pinish");
						
                        if(toComplete==1){
                            var sql = 'UPDATE mentor '
                                        + 'SET mession1 = 1 '
                                    + 'WHERE users_id = ' + id + '; '
                                    
                                    + 'UPDATE users SET '
                                        +	'reputation = reputation+10 '
                                    + 'WHERE id = ' + id
                            pool.query(sql); 
                        }
					}
					else{
						res.send("notPinish");						
					}					
				})
			}
            else if(mession_id==1 && result[0].mession1==1){
				var sql = 'SELECT count(*) AS buildingsCount '
                        + 'FROM usersBuildings '
                        + 'WHERE users_id = ' + id + ' AND type_id=1; '
                        
                        + 'SELECT count(*) AS buildingsCount '
                        + 'FROM usersBuildings '
                        + 'WHERE users_id = ' + id + ' AND type_id=2; '
				
				pool.query(sql,function(err,result){
                    var buildingCount1 = result[0][0].buildingsCount;
                    var buildingCount2 = result[0][0].buildingsCount;
					if(buildingCount1>4 && buildingCount2>1){
						res.send("pinish");
						
                        if(toComplete==1){
                            var sql = 'UPDATE mentor '
                                        + 'SET mession1 = 2 '
                                    + 'WHERE users_id = ' + id + '; '
                                    
                                    + 'UPDATE users SET '
                                        +	'reputation = reputation+40 '
                                    + 'WHERE id = ' + id
                            pool.query(sql); 
                        }
					}
					else{
						res.send("notPinish");						
					}					
				})
			}
			else if(mession_id==2 && result[0].mession2==0){
				var sql = 'SELECT level FROM usersBuildings WHERE users_id = ' + id + ' AND type_id=0;'
				
				pool.query(sql,function(err,result){
					var level = result[0]['level'];
					
					if(level>2){
						res.send("pinish");
						
                        if(toComplete==1){
                            var sql = 'UPDATE mentor '
                                        + 'SET mession2 = 1 '
                                    + 'WHERE users_id = ' + id + '; '
                                    
                                    + 'UPDATE users SET '
                                        +	'reputation = reputation+20 '
                                    + 'WHERE id = ' + id
                                    
                            pool.query(sql);
                        } 
					}
					else{
						res.send("notPinish");						
					}
				})
			}
            else if(mession_id==2 && result[0].mession2==1){
				var sql = 'SELECT level FROM usersBuildings WHERE users_id = ' + id + ' AND type_id=0;'
				
				pool.query(sql,function(err,result){
					var level = result[0]['level'];
					
					if(level>3){
						res.send("pinish");
						
                        if(toComplete==1){
                            var sql = 'UPDATE mentor '
                                        + 'SET mession2 = 2 '
                                    + 'WHERE users_id = ' + id + '; '
                                    
                                    + 'UPDATE users SET '
                                        +	'reputation = reputation+30 '
                                    + 'WHERE id = ' + id
                                    
                            pool.query(sql);
                        } 
					}
					else{
						res.send("notPinish");						
					}
				})
			}
            else if(mession_id==2 && result[0].mession2==2){
				var sql = 'SELECT level FROM usersBuildings WHERE users_id = ' + id + ' AND type_id=0;'
				
				pool.query(sql,function(err,result){
					var level = result[0]['level'];
					
					if(level>4){
						res.send("pinish");
						
                        if(toComplete==1){
                            var sql = 'UPDATE mentor '
                                        + 'SET mession2 = 3 '
                                    + 'WHERE users_id = ' + id + '; '
                                    
                                    + 'UPDATE users SET '
                                        +	'reputation = reputation+30 '
                                    + 'WHERE id = ' + id
                                    
                            pool.query(sql);
                        } 
					}
					else{
						res.send("notPinish");						
					}
				})
			}
			else if(mession_id==3 && result[0].mession3==0){
				var sql = 'SELECT MAX(level) AS max FROM usersBuildings WHERE users_id = ' + id + ' AND type_id=1;'
				
				pool.query(sql,function(err,result){
					var max = result[0]['max'];
					
					if(max>1){
                        res.send("pinish");
                        
                        if(toComplete==1){
                            
                            var sql = 'UPDATE mentor '
                                        + 'SET mession3 = 1 '
                                    + 'WHERE users_id = ' + id + '; '
                                    
                                    + 'UPDATE users SET '
                                        +	'reputation = reputation+15 '
                                    + 'WHERE id = ' + id
                                    
                            pool.query(sql); 
                        }
					}
					else{
						res.send("notPinish");						
					}
				})
			}
            else if(mession_id==3 && result[0].mession3==1){
				var sql = 'SELECT MAX(level) AS maxType1 ' 
                        + 'FROM usersBuildings '
                        + 'WHERE users_id = ' + id + ' AND type_id=1; '
                        
                        + 'SELECT MAX(level) AS maxType2 ' 
                        + 'FROM usersBuildings '
                        + 'WHERE users_id = ' + id + ' AND type_id=2; '
				
				pool.query(sql,function(err,result){
					var max1 = result[0][0]['maxType1'];
					var max2 = result[1][0]['maxType2'];
					
					if(max1>2 && max2>1){
                        res.send("pinish");
                        
                        if(toComplete==1){
                            
                            var sql = 'UPDATE mentor '
                                        + 'SET mession3 = 2 '
                                    + 'WHERE users_id = ' + id + '; '
                                    
                                    + 'UPDATE users SET '
                                        +	'reputation = reputation+30 '
                                    + 'WHERE id = ' + id
                                    
                            pool.query(sql); 
                        }
					}
					else{
						res.send("notPinish");						
					}
				})
			}
            else if(mession_id==4 && result[0].mession4==0){
				var sql = 'SELECT mession4_counter AS showCounter ' 
                        + 'FROM mentor '
                        + 'WHERE users_id = ' + id + '; '
				
				pool.query(sql,function(err,result){
                    var showCounter = result[0].showCounter
					
					if(showCounter>4){
                        res.send("pinish");
                        
                        if(toComplete==1){
                            
                            var sql = 'UPDATE mentor '
                                        + 'SET mession4 = 1 '
                                    + 'WHERE users_id = ' + id + '; '
                                    
                            pool.query(sql); 
                        }
					}
					else{
                        var sql = 'UPDATE mentor SET '
                                    + 'mession4_counter = mession4_counter+1 '
                                + 'WHERE users_id=' + id + '; '

                        pool.query(sql);
						res.send("notPinish");						
					}
				})
			}
			else{
				res.send("-10");
			}
			
		})
	}
	
	function updateMentor(res,req,id){
		var sql = 'SELECT * FROM users WHERE id=' + id + '; '
				+ 'SELECT * FROM usersCitys WHERE users_id=' + id + '; '
				+ 'SELECT * FROM usersBuildings WHERE users_id = ' + id + '; ';

		pool.query(sql,function(err,result){
			var userDetials = result[0][0];
			var mentorLevel = result[0][0].mentor;
			var citys = result[1];
			var buildings = result[2];

			if(mentorLevel == 1 && citys.length>0){
				var sql = 'UPDATE users SET '
						+ 'mentor=2 '
						+ 'WHERE id= ' + id;

				userDetials.mentor=2;
				pool.query(sql);
			}
			else if(mentorLevel == 2 && haveBuilding(0,buildings)==true){
				var sql = 'UPDATE users SET '
						+ 'mentor=3, '
						+ 'reputation = reputation+20 '
						+ 'WHERE id= ' + id;

				userDetials.mentor=3;
				pool.query(sql);
			}
			else if(mentorLevel == 3 && haveBuilding(1,buildings)==true){
				var sql = 'UPDATE users SET '
						+ 'mentor=4, '
						+ 'reputation = reputation+15 '
						+ 'WHERE id= ' + id;
				userDetials.mentor=4;
				pool.query(sql);
			}
            else if(mentorLevel == 4){
				var sql = 'UPDATE users SET '
						+ 'mentor=5 '
						+ 'WHERE id= ' + id;

				userDetials.mentor=5;
				pool.query(sql);
			}
			else if(mentorLevel == 5 && haveBuilding(2,buildings)==true){
				var sql = 'UPDATE users SET '
						+ 'mentor=6, '
						+ 'reputation = reputation+20 '
						+ 'WHERE id= ' + id;

				userDetials.mentor=6;
				pool.query(sql);
			}
			else if(mentorLevel == 6){
				var sql = 'UPDATE users '
                        + 'SET mentor=7 '
                        + 'WHERE id= ' + id;
				userDetials.mentor=7;
				
				pool.query(sql);
			}
			else if(mentorLevel == 7){
				var sql = 'UPDATE users SET mentor=8 WHERE id= ' + id;
				userDetials.mentor=8;
				
				pool.query(sql);
			}
            else if(mentorLevel == 8){
				var sql = 'UPDATE users SET mentor=13 WHERE id= ' + id;
				userDetials.mentor=13;
				
				pool.query(sql);
			}
			res.send(userDetials)
		})	
	}
	
	function counterBuilding(vtype,json){
		var loopLength = json.length;
		var counter = 0;
		for(var i=0; i<loopLength ;i++)
		{
			var checkType = json[i].type_id;
			if(checkType==vtype){
				counter++;
			}
		}
		
		return counter;
	}
	
	function haveBuilding(vtype,json){
		var loopLength = json.length;
		for(var i=0; i<loopLength ;i++)
		{
			var checkType = json[i].type_id;
			if(checkType==vtype){
				return true;
			}
		}
		
		return false;
	}
	function haveBuildingLevel(vtype,json){
		var loopLength = json.length;
		for(var i=0; i<loopLength ;i++)
		{
			var checkType = json[i].type_id;
			var checkLevel = json[i].level;
			console.log(checkLevel)
			if(checkType==vtype && checkLevel>1){
				return true;
			}
		}
		
		return false;
	}
	function level1(res,req,id){
		var city_id = req.query.city_id;
		
		async.waterfall([
			function(callback){
				var sql = 'SELECT * '
						+ 'FROM users '
						+ 'WHERE id=' + id;
						
				pool.query(sql,function(err,result){
					var userDetials = result[0];
					var mentor = result[0].mentor;
					
					if(mentor==1){
						callback(null,mentor,userDetials)
					}
					else{
						res.send(userDetials);
					}
				})
			},function(mentor,userDetials,callback){
				var sql = "DELETE FROM usersCitys "
						+ "WHERE users_id=" + id + " AND city='" + city_id + "'; "
				
						+ "INSERT usersCitys "
							+ "(users_id,city) "
						+ "VALUES "
							+ "(" + id + ",'" + city_id + "'); "
							
						+ "UPDATE users SET "
							+ "mentor=2, "
							+ "reputation=reputation + 5 "
						+ "WHERE id=" + id + '; '
						
						+ "SELECT * FROM users WHERE id=" + id + "; "
						
						+ "SELECT * "
						+ "FROM usersCitys "
						+ "WHERE users_id=" + id;
                        
				pool.query(sql,function(err,result){
					// userDetials = result[3];

					res.send(result)
				})

			}
		])
	}
}