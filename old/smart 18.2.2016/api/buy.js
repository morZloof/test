var buy = new buyJs();
function buyJs(){
	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];

		if(url == "addNewBuilding"){
			addNewBuilding(res,req,id);
		}
		else if(url == "updateBuilding"){
			updateBuilding(res,req,id);
		}
		else{
			res.send("error");
		}
	}
	this.ctor = ctor;
	
	// get: buildingId 
	// error: you dont have enough office level
	// error: you dont have enough main building level
	// error: you dont have money
	function updateBuilding(res,req,id){
		var buildingId = req.query.buildingId;

		async.waterfall([
			function(callback){
				var sql = 'SELECT * FROM usersBuildings WHERE id=' + buildingId + '; '+ 
				'SELECT * FROM users WHERE id=' + id + '; ' + 
				'SELECT level FROM usersBuildings WHERE users_id=' + id + ' AND type_id=0;'+
				'SELECT count(*) AS inBuild FROM buildingsTime WHERE users_id=' + id + ';';
				
				pool.query(sql,function(err,result){

					var buildingLevel = result[0][0]['level'];
					var money = result[1][0]['money'];
					var mainBuildingLevel = result[2][0]['level'];
					var inBuild = result[3][0]['inBuild'];
					var officeLevel = result[1][0].officeLevel;
					var vtype = result[0][0]['type_id'];
					var buildingInBuild = result[3][0]['inBuild'];
                    var other = result[0][0]['other'];
					var json = getBuildingsJson(vtype);
					var buildingPrice = json.levels[buildingLevel].price;

					var needMainBuildingLevel = json.levels[buildingLevel].mainBuilding;

					if(officeLevel<inBuild){
						res.send('error: you dont have enough office level');
					}
					else if(money<buildingPrice){
						res.send('error: you dont have money');
					}					
					else if((needMainBuildingLevel>mainBuildingLevel || needMainBuildingLevel==undefined) && (vtype!=0)){
						res.send('error: you dont have enough main building level');
					}
					else if(buildingInBuild==1){
						res.send('error: the building is in build')
					}
					else{
                        if(vtype==3 || vtype==7){
                            var sql = 'SELECT * '
                                    + 'FROM factoryReq '
                                    + 'WHERE factory_id=' + buildingId + '; '

                                    + 'SELECT * '
                                    + 'FROM usersBuildings '
                                    + 'WHERE id=' + other + '';

                            pool.query(sql,function(err,result){
                                callback(null,json,buildingLevel,buildingPrice,vtype,result)
                            })
                        }
                        else{
						  callback(null,json,buildingLevel,buildingPrice,vtype,null)
                        }
					}
				})
			},function(json,buildingLevel,buildingPrice,vtype,result,callback){
				var buildingSeconds = json.levels[buildingLevel].seconds;
				var buildingMinutes = json.levels[buildingLevel].minutes;
				var buildingHours = json.levels[buildingLevel].hours;
				var profit = json.levels[buildingLevel].profit;
				
				var nowTime = new Date().addSeconds(buildingSeconds);
				nowTime = nowTime.addMinutes(buildingMinutes);
				nowTime = nowTime.addHours(buildingHours);
				var endTime = formatDate(nowTime);

				var sql = 'INSERT INTO buildingsTime (usersBuildings_id,users_id,type,dateEnd)' +
				'VALUES (' + buildingId + ',' + id + ',' + vtype + ',"' + endTime + '"); ' +
                
				'UPDATE usersBuildings SET '
				+ 'level = level+1, '
				+ 'jsonProfit = ' + profit + ', '
				+ 'inBuild=1, '
				+ 'isUpdate=0 '
				+ 'WHERE id=' + buildingId + '; ';
                
                if(result!= null && (vtype==3 || vtype==7) && result[0]!=undefined && result[0][0]!=undefined){
                    var bid = result[0][0].bid;
                    var storeProfit = result[1][0].profit - bid;
                    var storeId = result[1][0].id;
                    var newfactoryProfit = formulas.factoryCalculate(buildingLevel,storeProfit)
                    
                    sql += 'UPDATE factoryReq SET '
                                + 'factoryAddProfit=' + newfactoryProfit + ' '
                            + 'WHERE factory_id=' + buildingId + ' AND store_id=' + storeId + '; ';
                }
                
				if(vtype==5){
					var maxMoney = json.levels[buildingLevel].maxMoney;

					sql += 'UPDATE users SET '
							+ 'money=money-' + buildingPrice + ', '
							+ 'maxMoney =' + maxMoney + ' '
						+ 'WHERE id=' + id + '; '
				}
				else{
					sql += 'UPDATE users SET '
							+ 'money=money-' + buildingPrice + ' '
						+ 'WHERE id=' + id + '; '
				}

				pool.query(sql);
				
				res.send('success: ' + endTime);
			}
		])
	}
	// get: lat lng vtype
	// -10: maximum buildings
	// error: you dont have enough office level
	// error: you dont have money
	function addNewBuilding(res,req,id)
	{
		var lat = parseFloat(req.query.lat);
		var lng = parseFloat(req.query.lng);
		var vtype = req.query.vtype;
		var json = getBuildingsJson(vtype);
		var streetName = req.query.streetName; 
		
		var buildingPrice = json.levels[0].price;
		var profit = json.levels[0].profit;
		var buildingSeconds = json.levels[0].seconds;
		var buildingMinutes = json.levels[0].minutes;
		var buildingHours = json.levels[0].hours;
		var distance = parseFloat('0.00186');

		if(vtype==1){ //change talbe if its residential or restaurant
			var table = 'residentialCount';
		}
		else if(vtype==2){
			var table = 'restaurantCount';
		}

		async.waterfall([
			function(callback){
				var sql = 'SELECT level FROM usersBuildings WHERE users_id=' + id + ' AND type_id=0;' + 
				'SELECT count(*) AS buildingCounter FROM usersBuildings WHERE users_id=' + id + ' AND type_id=' + vtype + '; ' +
				'SELECT money,officeLevel FROM users WHERE id=' + id + '; ' +
				'SELECT count(*) AS conterBuilding FROM buildingsTime WHERE users_id=' + id + '; ' +
				'SELECT count(*) AS counter FROM streets WHERE name="' + streetName + '";'
				
				pool.query(sql,function(err,result){
					
					var checkStreet = result[4][0]['counter'];
					if(result[0].length==0){ // for main building
						var mainLevel = 1;						
					}
					else{
						var mainLevel = parseInt(result[0][0]['level']);
					}
					
					if(vtype==0){ // for main building
						var canBuild = 1;
					}
					else{
						var canBuild = parseInt(json_mainBuilding.building[mainLevel-1].type[vtype-1].number);
					}
					
					var buildingCounter = parseInt(result[1][0]['buildingCounter']);
					var money = parseInt(result[2][0].money);
					var officeLevel = parseInt(result[2][0].officeLevel);
					var inBuildNow = parseInt(result[3][0].conterBuilding);
					
					if(inBuildNow>0){
						res.send('error: you dont have enough office level');
					}
					else if(canBuild>buildingCounter){
						callback(null,money,checkStreet)
					}
					else{
						res.send('-10: maximum buildings');
					}
				})
			},function(money,checkStreet,callback){				
				if(money>buildingPrice){
					callback(null,checkStreet);
				}
				else{
					res.send('error: you dont have money');
				}
			},function(checkStreet,callback){
				
				// res.send("zloof");
				var nowTime = new Date().addSeconds(buildingSeconds);
				nowTime = nowTime.addMinutes(buildingMinutes);
				nowTime = nowTime.addHours(buildingHours);
				var endTime = formatDate(nowTime);
				
				var sql = 'INSERT INTO usersBuildings '
						+ '(users_id,profit,jsonProfit,type_id,lat,lng,street,inBuild) values '
						+ '("' + id + '",' + profit  + ',' + profit  + ',"' + vtype + '","' + lat + '","' + lng + '","' + streetName + '",1);'

				+ 'INSERT INTO buildingsTime (usersBuildings_id,users_id,type,dateEnd) '
				+ 'VALUES ((SELECT MAX(id) FROM usersBuildings WHERE users_id=' + id + '),' + id + ',' + vtype + ',"' + endTime + '"); '

				if(vtype==5){
					var maxMoney = json.levels[0].maxMoney;
					sql += 'UPDATE users SET '
							+ 'money = money-' + buildingPrice + ', '
							+ 'maxMoney =' + maxMoney + ' '
						+ 'WHERE id=' + id + '; '
				}
				else{
					sql += 'UPDATE users SET '
							+ 'money=money-' + buildingPrice + ' '
						+ 'WHERE id=' + id + '; '
				}

				if(vtype=="1" || vtype=="2"){
					sql += 'UPDATE usersBuildings SET '
						+ 'isUpdate = 0 '
					+ 'WHERE lat<"' + (lat + distance) + '" AND lng<"' + (lng + distance) + '" AND '
					+ 'lat>"' + (lat - distance) + '" AND lng>"' + (lng - distance) + '" AND '
					+ 'lat<>"' + lat + '" AND lng<>"' + lng + '" AND street<>"' + streetName + '"; ';
					
					sql += 'UPDATE usersBuildings SET '
						+ 'isUpdate = 0 '
					+ 'WHERE street="' + streetName + '"; ';
				}

				if(checkStreet==0){
					sql += 'INSERT INTO streets '
						 + '(name,city,' + table + ') '
							+ 'VALUES '
						 + '("' + streetName + '","mor",1)'
				}
				else if(vtype==1){
					sql += 'UPDATE streets SET '
						 	+ table + '=' + table + '+1 '
						 + 'WHERE name="' + streetName + '";'
				}
				else if(vtype==2){
					sql += 'UPDATE streets SET '
						 	+ table + '=' + table + '+1 '
						 + 'WHERE name="' + streetName + '";'
				}

				if(vtype==4){
					console.log(1)
					company.createCompany(res,req,id);
				}
				
				pool.query(sql);
				res.send("success: " + endTime);
				// money.updateUser(id);
			}
		])
	}
	
	// function calculateRestaurant(json,lat,lng,profit){
	// 	// var closest = 0.016231742057263805;
	// 	var farest = 0.5;
		
	// 	var loopLength = json.length;
	// 	var earthRadius = 6371;
	// 	var influenceArry = [];
		
	// 	for(var i=0; i<loopLength ;i++){
	// 		var building_lat = json[i].lat;
	// 		var building_lng = json[i].lng;
			
	// 		var newLat = building_lat-lat; // Difference of latitude
    // 		var newLng = building_lng-lng; 
	
	// 		var disLat = (newLat*Math.PI*earthRadius)/180; // Vertical distance
	// 		var disLng = (newLng*Math.PI*earthRadius)/180; // Horizontal distance
		
	// 		var distance = Math.pow(disLat, 2) + Math.pow(disLng, 2); 
	// 		distance = Math.sqrt(distance);
			
	// 		if(distance>farest){
	// 			var influence = 0;
	// 		}
	// 		else{
	// 			var influence = 100 - (distance*100/farest);
	// 		}
	// 		influenceArry[i] = influence; 
	// 	}
	
	// 	if(loopLength>4){
	// 		var sortArr = influenceArry.sort(function(a,b) { return a - b; }); 
	// 		influenceArry = sortArr;
	// 	}
		
	// 	if(loopLength==1){//20%
	// 		var present = 20;
	// 		var minus = influenceArry[0]*present/100
	// 	}
	// 	else if(loopLength==2){//30%
	// 		var present = 30;
	// 		var minus = (influenceArry[0]+influenceArry[1])*present/200;
	// 	}
	// 	else if(loopLength==3){//40%
	// 		var present = 40;
	// 		var minus = (influenceArry[0]+influenceArry[1]+influenceArry[2])*present/300;
	// 	}
	// 	else if(loopLength==4){//50%
	// 		var present = 50;
	// 		var minus = (influenceArry[0]+influenceArry[1]+influenceArry[2]+influenceArry[3])*present/400;
	// 	}
	// 	else{//60%
	// 		var present = 60;
	// 		var minus = (influenceArry[0]+influenceArry[1]+influenceArry[2]+influenceArry[3]+influenceArry[4])*present/500;
	// 	}
		
	// 	return minus;
	// }
}
