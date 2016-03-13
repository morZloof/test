var company = new companyJS();
function companyJS(){

	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];

		if(url == "createCompany")
		{
			createCompany(res,req,id)
		}
		else if(url == "sendReq"){
			sendReq(res,req,id);
		}
		else if(url == "cancelReq"){
			cancelReq(res,req,id);
		}
		else if(url == "confirmReq"){
			confirmReq(res,req,id);
		}
		else if(url == "JoinCompany"){
			JoinCompany(res,req,id)
		}
		else if(url == "leaveCompany"){
			leaveCompany(res,req,id)
		}
		else if(url == "removeUserFromCompany"){
			removeUserFromCompany(res,req,id);
		}
		else if(url=="getClanDetailsFromId"){
			getClanDetailsFromId(res,req,id);
		}
		else if(url=="checkCompanyName"){
			checkCompanyName(res,req,id);
		}
		else{
			res.send(req.originalUrl.split('/')[3]);
		}
	}
	this.ctor = ctor;

	// check if company name is ok
	function checkCompanyName(res,req,id){
		var companyName = req.query.companyName;

		async.waterfall([
			function countSreets(callback) { // check company name length
				if(companyName.length<3 || companyName.length>14){
					//res.send("error: company name length between 3-15 chars");
				}
				else{
					callback(null)
				}
			},function addStreetToUser(callback){ //check if contry name exist or user have company
				var sql = 'SELECT count(*) AS countCountry FROM companys WHERE name="' + companyName + '";'+
					'SELECT count(*) AS userCountry FROM users where id=' + id + ' AND companys_name=null;'

				pool.query(sql,function(err,result){

					if(result[1][0]['userCountry']>0){
						res.send("-10");
					}
					else if((result[0][0]['countCountry']==0) && (result[1][0]['userCountry']==0)){
						res.send('success');
					}
					else{
						res.send("error: name exist");
					}
				})
			}
		]);
	}

	function removeUserFromCompany(res,req,id){
		var user_id = req.query.user_id;
		
		var sql = 'SELECT * FROM companysUsers WHERE users_id = ' + id + ';';
		
		pool.query(sql,function(err,result){
			if(result[0]==undefined){
				res.send("-10");
				return;
			}
			
			var admin = result[0].admin;
			
			if(admin==1){
				var sql = 'UPDATE users SET '
							+ 'companys_name = null, '
							+ 'companys_id = null '
						+ 'WHERE id = ' + user_id + '; '
				console.log(sql);
				pool.query(sql,function(err,result){
					res.send("success");	
				})
			}
		})
	}
	function getClanDetailsFromId(res,req,id) {
		var clanId = req.query.clanId;
		var sql = "SELECT * "
				+ "FROM companys "
				+ "WHERE companys.id = '" + clanId + "%' LIMIT 30; "
		 		
				 + "SELECT * "
				+ "FROM users  "
				+ ' WHERE users.companys_id = '+clanId+';'
				
		pool.query(sql,function(err,reuslt) {
			res.send(reuslt);
		});
	}
	
	//get: notification_id
	//url: /api/company/confirmReq/?id=1
	function confirmReq(res,req,id){
		var notification_id = req.query.notification_id;

		async.waterfall([
			function(callback){
				var sql = 'SELECT * '
						+ 'FROM users '
						+ 'WHERE id=' + id + '; '

						+ 'SELECT * '
						+ 'FROM notification '
						+ 'WHERE id=' + notification_id + '; ';

				pool.query(sql,function(err,result){
					var admin = result[0][0]['admin'];
					var companyId = result[0][0]['companys_id'];
					var companyName = result[0][0]['companys_name'];
					var reqId = result[1][0].obj_id;

					if(admin == 1){
						callback(null,companyId,companyName,reqId);
					}
					else{
						res.send("-10");
					}
				})
			},function(companyId,companyName,reqId,callback){
				var sql = 'SELECT * FROM companysReq WHERE id=' + reqId + ';';
				pool.query(sql,function(err,result){

					if(result[0] != undefined){
						var sendId = result[0]['users_id'];

						var sql = 'SELECT count(*) AS countCompanys FROM users WHERE id=' + sendId + ' AND companys_name IS null;';
						pool.query(sql,function(err,result){
							if(result[0]['countCompanys']==1){
								callback(null,companyId,companyName,sendId);
							}
							else{
								res.send("-10");
							}
						})
					}
					else{
						res.send("-10");
					}
				})
			},function(companyId,companyName,sendId,callback){
				var sql =  'UPDATE users SET '
							+ 'companys_name = "' + companyName + '", '
							+ 'companys_id = ' + companyId + ' '
						+ 'WHERE id = ' + sendId + '; '
						+ 'DELETE FROM companysReq WHERE users_id=' + sendId + '; '

						+ 'DELETE FROM notification '
						+ 'WHERE id=' + notification_id + ' LIMIT 1; '

						+ 'INSERT INTO notification '
						+ '(users_id,name,type_id) '
							+ 'VALUES '
						+ '(' + sendId + ',"' + companyName + '",6)'

				pool.query(sql);

				res.send("sucsses");
			}
		])
	}
	//get: req id
	//error: -10 if the user is not admin
	//url: http://212.199.178.35/api/company/cancelReq/?id=3&session=e0bd23fe-a174-f4d5-0f33-439f82a988d1
	function cancelReq(res,req,id){
		var notification_id = req.query.notification_id;

		async.waterfall([
			function(callback){

				var sql = 'SELECT * '
						+ 'FROM users '
						+ 'WHERE id=' + id + '; '

						+ 'SELECT * '
						+ 'FROM notification '
						+ 'WHERE id=' + notification_id + '; ';

				pool.query(sql,function(err,result){
					var checkAdmin = result[0][0]["admin"];
					if(checkAdmin==1){
						var reqId = result[1][0].obj_id;
						callback(null,reqId);
					}
					else{
						res.send("-10");
					}
				})
			},function(reqId, callback){
				var sql = 'DELETE FROM companysReq '
						+ 'WHERE id=' + reqId + '; '

						+ 'DELETE FROM notification '
						+ 'WHERE id=' + notification_id + ' LIMIT 1; '

				pool.query(sql);
				
				res.send("sucsses");	
			}
		])
	}

	// get: companyId
	// error: you all ready send req
	// error: you have country
	// url: http://212.199.178.35/api/company/sendReq/?companyId=28&session=e0bd23fe-a174-f4d5-0f33-439f82a988d1
	function sendReq(res,req,id){
		var companyId = req.query.companyId;

		async.waterfall([
			function(callback){
				var sql = 'SELECT count(*) AS reqCount FROM companysReq WHERE companys_id=' + companyId + ' AND users_id=' + id + '; '
				+ 'SELECT companys_id FROM users WHERE id=' + id + '; '
				+ 'SELECT * FROM users WHERE id=' + id + '; ';

				pool.query(sql,function(err,result){
					if(result[1][0]['companys_id']>0){
						res.send("you have country");
					}
					else if(result[0][0]['reqCount']>0){
						res.send("you all ready send req");
					}
					else if((result[1][0]['companys_id']==null) && (result[0][0]['reqCount']==0)){
						var userName = result[2][0].userName
						callback(null,userName );
					}
					else{
						res.send("-10");
					}
				})
			},function(userName,callback){
				var sql = 'INSERT INTO companysReq '
						+ '(companys_id,users_id) '
							+ 'values '
						+ '("' + companyId + '","' + id + '"); '

						+ 'INSERT INTO notification '
						+ '(users_id,other,name,type_id,obj_id) '
							+ 'values '
						+ '((SELECT id FROM users WHERE companys_id=' + companyId + ' AND admin=1),' + id + ',"' + userName  + '",5,(SELECT id FROM companysReq WHERE companys_id=' + companyId + ' AND users_id=' + id + '))'

				pool.query(sql);
						
				res.send("sucsses");
			}
		]);
			
		
		
		// res.send("aa");
	}

	// get: companyName
	// error: name exist
	// error: -10 ... if user is in anther company
	// error: company name length between 3-15 chars
	// url: /api/company/CreateCompany/?companyName=test&session=e0bd23fe-a174-f4d5-0f33-439f82a988d1
	function createCompany(res,req,id){
		console.log(req.query);
		var companyName = req.query.companyName;
		var lat = req.query.lat;
		var lng = req.query.lng;

		async.waterfall([
			function countSreets(callback) { // check company name length
				if(companyName.length<3 || companyName.length>14){
					//res.send("error: company name length between 3-15 chars");
				}
				else{
					callback(null)
				}
			},function addStreetToUser(callback){ //check if contry name exist or user have company
				var sql = 'SELECT count(*) AS countCountry FROM companys WHERE name="' + companyName + '";'+
				'SELECT count(*) AS userCountry FROM users where id=' + id + ' AND companys_name=null;'
				
				pool.query(sql,function(err,result){
					
					if(result[1][0]['userCountry']>0){
						//res.send("-10");
					}
					else if((result[0][0]['countCountry']==0) && (result[1][0]['userCountry']==0)){
						callback(null);
					}
					else{
						//res.send("error: name exist")
					}
				})
			},function(callback){ //create company and take company id
				var sql = 'INSERT INTO companys (name,rank,power) VALUES ("' + companyName + '",0,0); '
						+ 'UPDATE users SET companys_name="' + companyName + '",admin=1, companys_id=(SELECT id FROM companys WHERE name = "' + companyName + '") WHERE id=' + id + '; '

				pool.query(sql,function(err,result){
					var sql = 'SELECT id FROM companys WHERE name="' + companyName + '"';
					pool.query(sql,function(err,result){
						var companyId = result[0]['id'];
						
						//res.send("success");
					})
				})
			}
		]);
	}
	this.createCompany = createCompany;
	// company_id
	function JoinCompany(res,req,id){
		var company_id=req.query.company_id;
		var sql = 'INSERT INTO user_company (user_id,company_id) VALUES ("'+id+'","'+company_id+'")';
		pool.query(sql,function(err,result){
			res.send(result)
			res.send(err)
		})
	}

	
	function leaveCompany(res,req,id){
		async.waterfall([
			function (callback) {
				var sql = 'SELECT * FROM users WHERE companys_id IN (SELECT companys_id FROM users WHERE id = ' + id + ')';

				pool.query(sql,function(err,result){
					if(result[0]==undefined){
						res.send("-10: you dont have clan");
						return;
					}
					
					var companys_id = result[0].companys_id;
					var admin = result[0].admin

					if(result.length==1){
						var sql = 'DELETE FROM usersBuildings WHERE companys_id = ' + companys_id + '; '
								
								+ 'UPDATE users SET '
									+ 'companys_name = null, '
									+ 'companys_id = null, '
									+ 'admin = 0 '
								+ 'WHERE id = ' + id + '; '
								
								+ 'DELETE FROM companys '
								+ 'WHERE id = ' + companys_id + ' LIMIT 1;'
								
						pool.query(sql,function(err,result){
							res.send("success")
						});
					}
					else if(admin==1){
						var sql = 'UPDATE users '
									+ 'SET admin = 1 ' 
								+ 'WHERE id != ' + id + ' AND companys_id=' + companys_id + ' ORDER BY rand() LIMIT 1; '
								
								+ 'UPDATE users SET '
									+ 'companys_name = null, '
									+ 'companys_id = null, '
									+ 'admin = 0 '
								+ 'WHERE id = ' + id;
						
						pool.query(sql,function(err,result){
							res.send("success");
						})
					}
					else if(admin==0){
						var sql = 'UPDATE users SET '
									+ 'companys_name = null, '
									+ 'companys_id = null, '
									+ 'admin = 0 '
								+ 'WHERE id = ' + id;
						
						pool.query(sql,function(err,result){
							res.send("success")
						})
					}
					else{
						res.send("-10")
					}
				})
			},function (){
				res.send("mor")
			}
		]);
	}
}
