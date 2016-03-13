var war = new warJs()
function warJs(){
    function ctor(res, req, id) {
		var url = req.originalUrl.split('/')[3];

		if(url == "attack"){
			attack(res, req, id);
		}
		else if(url == 'cancelReq'){
			cancelReq(res,req,id);
		}
		else if(url == 'comfirmReq'){
			comfirmReq(res,req,id);
		}
		else if(url == 'searchUser'){
			searchUser(res,req,id);
		}
		else if(url == 'getUserRestuarants'){
			getUserRestuarants(res,req,id);
		}
        else if(url=='getFactoryBid'){
			getFactoryBid(res,req,id);
        }
		else if(url == 'getRestuarantsBid'){
		 	getRestuarantsBid(res,req,id);
		}
		else if(url == 'showBid'){
			showBid(res,req,id);
		}
        else if(url == 'getStoreProfit'){
            getStoreProfit(res,req,id);
        }
        else if(url == 'randomRestuarant'){
            randomRestuarant(res,req,id);
        }
		else {
			res.send("error in war.js");

		}
	}
	this.ctor = ctor;

    function randomRestuarant(res,req,id){
        var isRestuarant = req.query.isRestuarant;
        if(isRestuarant==1){
            var sql = 'SELECT * FROM usersBuildings WHERE type_id=2 AND users_id<>' + id + ' AND other is null ORDER BY RAND() LIMIT 1;'
        }
        else{
            var sql = 'SELECT * FROM usersBuildings WHERE type_id=6 AND users_id<>' + id + ' AND other is null ORDER BY RAND() LIMIT 1;'
        }
        
        pool.query(sql,function(err,result){
            res.send(result)
        });
    }
    
    function getStoreProfit(res,req,id){
        var factoryId = req.query.factoryId;
        
        var sql = 'SELECT * '
                + 'FROM usersBuildings '
                + 'WHERE id=(SELECT store_id FROM factoryReq WHERE factory_id=' + factoryId + ');';
        
        pool.query(sql,function(err,result){
            res.send(result)
        })
    }
    
	function showBid(res,req,id){
		var store_id = req.query.store_id;

		var sql = 'SELECT * ' // my restaurant
				+ 'FROM usersBuildings '
				+ 'WHERE id='+ store_id + '; '

				+ 'SELECT * ' // bid
				+ 'FROM factoryReq '
				+ 'WHERE store_id=' + store_id + '; '

				+ 'SELECT * ' // other factory
				+ 'FROM usersBuildings '
				+ 'WHERE id IN '
					+ '(SELECT factory_id '
					+ 'FROM factoryReq '
					+ 'WHERE store_id=' + store_id + ') '

		pool.query(sql,function(err,result){
			res.send(result);
		})
	}

    function getFactoryBid(res,req,id){
        var store_id = req.query.store_id;

        var sql = 'SELECT * '
                + 'FROM usersBuildings '
                + 'WHERE id IN '
                    + '(SELECT other '
                    + 'FROM usersBuildings '
                    + 'WHERE id=' + store_id + ');'

        pool.query(sql,function(err,result){
            res.send(result);

        })

    }

	 // GET: store_id
	 function getRestuarantsBid(res,req,id){
	 	var store_id = req.query.store_id;

	 	var sql = 'SELECT * '
	 			+ 'FROM factoryReq '
	 			+ 'WHERE store_id=' + store_id +'; '

	 			+ 'SELECT * '
	 			+ 'FROM users '
	 			+ 'WHERE id IN '
	 				+ '(SELECT users_id '
	 				+ 'FROM usersBuildings '
	 				+ 'WHERE id=' + store_id + '); '

		 		+ 'SELECT * '
		 		+ 'FROM usersBuildings '
		 		+ 'WHERE id = ' + store_id + '; '

				+ 'SELECT * '
				+ 'FROM usersBuildings '
				+ 'WHERE id IN '
					 + '(SELECT factory_id '
					 + 'FROM factoryReq '
					 + 'WHERE store_id=' + store_id +'); '

		 		+ 'SELECT * '
		  		+ 'FROM users '
		 		+ 'WHERE id IN '
					 + '(SELECT get_users_id '
					 + 'FROM factoryReq '
					 + 'WHERE store_id=' + store_id +'); '

	 	pool.query(sql,function(err,result){
	 		res.send(result);
	 	})
	 }

	//GET: user_id
	function getUserRestuarants(res,req,id){
        
		var user_id = req.query.user_id;

		var sql = 'SELECT * ' //my retaurant
				+ 'FROM usersBuildings '
				+ 'WHERE users_id=' + user_id + ' AND (type_id=2 OR type_id=6); '

				+ 'SELECT * '//bid of store
				+ 'FROM factoryReq '
				+ 'JOIN users ON users.id=factoryReq.send_users_id '
				+ 'WHERE factoryReq.factory_id IN '
					+ '(SELECT other '
					+ 'FROM usersBuildings '
					+ 'WHERE users_id=' + user_id + ' AND (other<>0 AND other IS NOT null) AND (type_id=2 OR type_id=6)); '

				+ 'SELECT * ' // all restaurants customers
				+ 'FROM usersBuildings '
				+ 'WHERE id IN '
					+ '(SELECT store_id '
					+ 'FROM factoryReq '
					+ 'WHERE send_users_id = ' + user_id + '); '

                + 'SELECT * ' // all factory supplier
				+ 'FROM factoryReq '
                + 'JOIN usersBuildings ON usersBuildings.id = factoryReq.factory_id '
				+ 'WHERE send_users_id = ' + user_id + '; '

				+ 'SELECT * ' // all users customers
				+ 'FROM users '
				+ 'WHERE id IN '
					+ '(SELECT get_users_id '
					+ 'FROM factoryReq '
					+ 'WHERE send_users_id = ' + user_id + '); '

		pool.query(sql,function(err,result){
            console.log(result);
			res.send(result);
		})

	}

	function searchUser(res,req,id){
		var userName = req.query.userName;

		var sql = 'SELECT * FROM users WHERE userName LIKE "' + userName + '%" LIMIT 30;'
		pool.query(sql,function(err,result){
			res.send(result);
		})
	}

	// GET: notification_id
	// error:is all ready comfirm
	function comfirmReq(res,req,id){
		var notification_id = req.query.notification_id;

		async.waterfall([
			function(callback){
				var sql = 'select COUNT(*) AS counter '
						+ 'FROM notification '
						+ 'WHERE id=' + notification_id + '; '

						+ 'SELECT * '
						+ 'FROM notification '
						+ 'WHERE id=' + notification_id + ';';

				pool.query(sql,function(err,result){
					if(result[0][0].counter==0){
						res.send('-10');
					}
					else{
						var factoryReq_id = result[1][0].obj1_id;
						var sql = 'SELECT * '
								+ 'FROM factoryReq '
								+ 'WHERE id=' + factoryReq_id + ';';

						pool.query(sql,function(err,result){
							var json = result[0];
							callback(null,json);
						})

					}

				})

			},function(json,callback){
				var comfirm = json.comfirm;
				if(comfirm==1){
                	res.send('error: you all ready comfirm ');
				}
				else{
					var store_id = json.store_id;
                    var storeAddProfit = json.storeAddProfit;
					var factory_id = json.factory_id;
					var send_users_id = json.send_users_id;

					var sql = 'UPDATE usersBuildings SET '
								+ 'other=' + factory_id + ', '
								+ 'isUpdate=0 '
							+ 'WHERE id=' + store_id + '; '

							+ 'UPDATE usersBuildings SET '
								+ 'other=' + store_id + ', '
                                + 'jsonProfit=' + storeAddProfit + ', '
								+ 'isUpdate=0 '
							+ 'WHERE id=' + factory_id + '; '

							+ 'UPDATE factoryReq SET '
								+ 'comfirm=1 '
							+ 'WHERE store_id=' + store_id + ' AND factory_id=' + factory_id + '; '

							+ 'INSERT INTO notification '
					 		+ '(users_id,other,name,type_id) '
							+ 'VALUES '
							+ '(' + send_users_id + ',null,"mor",3); '

							+ 'DELETE FROM notification '
							+ 'WHERE id=' + notification_id + ';'

					pool.query(sql);

					res.send('success');

				}
			}
		])
	}
    function comfirmReqAction(factoryReq_id){
		async.waterfall([
			function(callback){
                var sql = 'SELECT * '
                        + 'FROM factoryReq '
                        + 'WHERE id=' + factoryReq_id + ';';

                pool.query(sql,function(err,result){
                    var json = result[0];
                    callback(null,json);
                })


			},function(json,callback){
				var comfirm = json.comfirm;
				if(comfirm==1){
                	return;
				}
				else{
					var store_id = json.store_id;
                    var storeAddProfit = json.storeAddProfit;
					var factory_id = json.factory_id;
					var send_users_id = json.send_users_id;
                    var get_users_id = json.get_users_id;

					var sql = 'UPDATE usersBuildings SET '
								+ 'other=' + factory_id + ', '
								+ 'isUpdate=0 '
							+ 'WHERE id=' + store_id + '; '

							+ 'UPDATE usersBuildings SET '
								+ 'other=' + store_id + ', '
                                + 'jsonProfit=' + storeAddProfit + ', '
								+ 'isUpdate=0 '
							+ 'WHERE id=' + factory_id + '; '

							+ 'UPDATE factoryReq SET '
								+ 'comfirm=1 '
							+ 'WHERE store_id=' + store_id + ' AND factory_id=' + factory_id + '; '

							+ 'INSERT INTO notification '
					 		+ '(users_id,other,name,type_id) '
							+ 'VALUES '
							+ '(' + send_users_id + ',null,"mor",3); '
                            
                            + 'INSERT INTO notification '
					 		+ '(users_id,other,name,type_id) '
							+ 'VALUES '
							+ '(' + get_users_id + ',null,"mor",7); '
                            
					pool.query(sql);
				}
			}
		])
    }
    this.comfirmReqAction = comfirmReqAction;
    
	// GET: notification_id
	function cancelReq(res,req,id){
		var notification_id = req.query.notification_id;

		async.waterfall([
			function(callback){
				var sql = 'select COUNT(*) AS counter '
					+ 'FROM notification '
					+ 'WHERE id=' + notification_id + '; '

					+ 'SELECT * '
					+ 'FROM notification '
					+ 'WHERE id=' + notification_id + ';';

				pool.query(sql,function(err,result){
					if(result[0][0].counter==0){
						res.send('-10');
					}
					else{
						var other = result[1][0].obj_id;
						var sql = 'SELECT * '
							+ 'FROM factoryReq '
							+ 'WHERE send_users_id=' + other + ';';

						pool.query(sql,function(err,result){
							var json = result[0];
							callback(null,json);
						})
					}

				})

			},function(json,callback){
				var comfirm = json.comfirm;
				if(comfirm==1){
					res.send('error: you all ready comfirm ');
				}
				else{
					var store_id = json.store_id;
					var factory_id = json.factory_id;
					var send_users_id = json.send_users_id;

					var sql = 'DELETE FROM factoryReq '
							+ 'WHERE send_users_id=' + send_users_id + ' AND get_users_id=' + id + '; '

							+ 'INSERT INTO notification '
							+ '(users_id,other,name,type_id) '
							+ 'VALUES '
							+ '(' + send_users_id + ',null,"mor",4);'

							+ 'DELETE FROM notification '
							+ 'WHERE id=' + notification_id + ' LIMIT 1;'

					pool.query(sql);
					res.send('success');
				}
			}
		])
	}

	// GET: building_id,my_building_id,bid
	// error: this is not restuarant
	// error: you cant do this bid
	// error: you can send only one req
	function attack(res,req,id){
		var my_building_id = req.query.my_building_id;
		var store_id = req.query.store_id;
		var bid = req.query.bid;

		async.waterfall([
			function(callback){
				var sql = 'SELECT * '
					+ 'FROM usersBuildings '
					+ 'WHERE id=' + store_id + '; '

					+ 'SELECT COUNT(*) AS warCounter '
					+ 'FROM factoryReq '
					+ 'where factory_id=' + my_building_id + '; '

					+ 'SELECT * '
					+ 'FROM usersBuildings '
					+ 'WHERE id=' + my_building_id + '; '

					+ 'SELECT * '
					+ 'FROM users '
				    + 'WHERE id=' + id + '; '

					+ 'SELECT * '
					+ 'FROM users '
					+ 'WHERE id IN '
						+ '(SELECT users_id '
						+ 'FROM usersBuildings '
						+ 'WHERE id=' + store_id + '); '

				pool.query(sql,function(err,result){
					var type_id = result[0][0].type_id;
					var factory_type_id = result[2][0].type_id
					var get_users_id = result[0][0].users_id;
					var other = result[0][0].other;

					var warCounter = result[1][0].warCounter;
					var restaurantProfit = result[0][0].profit;
					var factoryLevel = result[2][0].level;
					var userName = result[3][0].userName;
                    var mentorLevel = result[3][0].mentor;

					var userName = result[4][0].userName;
					var newProfit = formulas.factoryCalculate(factoryLevel,restaurantProfit,bid);
                    var factoryBonus = newProfit-bid;
                    
					if(type_id!=2 && type_id!=6){
						res.send('error: this is not restuarant');
					}
					else if(factory_type_id!=3 && factory_type_id!=7){
						res.send('error: this is not factory');
					}
					else if(newProfit<bid){
                        
						res.send('error: you cant do this bid');
					}
					else if(warCounter>0){
						res.send('error: you can send only one req');
					}
					else{
						callback(null,get_users_id,userName,other,factory_type_id,factoryBonus,mentorLevel);
					}
				})
			},function(get_users_id,userName,other,factory_type_id,factoryBonus,mentorLevel,callback){
				if(factory_type_id==7){
					var isRestaurant = 0;
				}
				else{
					var isRestaurant = 1;
				}

				var endDate = formatDate(new Date().addHours(12));
				var sql = 'INSERT INTO factoryReq '
						+ '(get_users_id,send_users_id,store_id,factory_id,bid,factoryAddProfit,storeAddProfit,isRestaurant,endDate) '
							+ 'VALUE '
						+ '(' + get_users_id  + ',' + id + ',' + store_id + ',' + my_building_id + ',' + bid + ',' + factoryBonus + ',' + bid + ',' + isRestaurant + ',"' + endDate + '"); '

						+ 'INSERT INTO notification '
						+ '(users_id,other,obj_id,obj1_id,name,type_id) '
							+ 'VALUE '
						+ '(' + get_users_id + ',' + store_id + ',' + id + ',(SELECT max(id) FROM factoryReq WHERE send_users_id=' + id + '),"' + userName + '",1); ';
                
				if(other!=0 && other!=undefined){
					sql += 'INSERT INTO notification '
						 + '(users_id,other,name,type_id) '
							 + 'VALUE '
						 + '((SELECT users_id FROM usersBuildings WHERE id=' + other + '),' + id + ',"' + userName + '",2); ';
				}
				pool.query(sql);
				res.send('ok');
			}
		])
	}
}