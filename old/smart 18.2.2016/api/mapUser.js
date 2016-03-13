// var mapUsers = new mapUsersJs();
// function mapUsersJs(){
//
// 	function ctor(res,req,id){
// 		var url = req.originalUrl.split('/')[3];
//
// 		if(url == "addCity"){
// 			addCity(res,req,id);
// 		}
// 		else if(url == "addStreet"){
// 			addStreet(res,req,id);
// 		}
// 		else{
// 			res.send("error");
// 		}
// 	}
// 	this.ctor = ctor;
//
// 	function addCity(res,req,id){
// 		var cityId = req.query.cityId;
// 		var cityName = req.query.cityId;
// 		var sql = 'INSERT INTO usersCitys' +
// 					'(users_id,id,cityName) '+
// 					'values("'+id+'","'+cityId+'","'+cityName+'");';
//
// 		pool.query(sql,function(err,result){
// 			res.send(result);
// 		});
// 	}
//
// 	function addStreet(res,req,id){
// 		var streetName = req.query.streetName;
// 		var cityId = req.query.cityId;
// 		async.waterfall([
// 	    function countSreets(callback)
// 			{
// 				console.log();
// 				var sql = 'SELECT id FROM streets WHERE name ="' + streetName + '" LIMIT 1;';
// 				pool.query(sql,
// 					function(err,result)
// 					{
// 						console.log(result);
// 						callback(null,result);
// 					});
// 				},
// 		    function returnStreetId (streetId, callback) {
//
// 				}
//
// 	    	},
// 				function addStreetToUser(streetId){
// 					pool.query(sql);
//
// 				res.send("every thing is good my love")
// 			}
//
// 		]);
// 	}
// }
