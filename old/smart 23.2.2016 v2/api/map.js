var map = new mapJs();
function mapJs(){

	function ctor(res,req,id){
		var url = req.originalUrl.split('/')[3];
		
		if(url == "showStreet"){
			showStreet(res,req);
		}
		else if(url == "showCity"){
			showCity(res,req);
		}
		else if(url == "showBuildings"){
			showBuildings(res,req,id)
		}
		else if(url == "showBuildingsInArea"){
			showBuildingsInArea(res,req,id);
		}
		// else if(url == "oztest"){
		// 	oztest(res,req,id);
		// }
		else{
			res.send("error");
		}
	}
	this.ctor = ctor;
	
	// function oztest(res,req,id){
	// 	var sql = 'SELECT * FROM telAviv1 WHERE name="מענית";'+
	// 	'SELECT * FROM telAviv1 WHERE name="יהודה הימית"';
		
	// 	pool.query(sql,function(err,result){
	// 		res.send(result);
	// 	})
	// }
	// get: lat lng
	function showBuildings(res,req,id){
		
		var west = req.query.west;
		var south = req.query.south;
		var east = req.query.east;
		var north = req.query.north;

		var sql = "SELECT *,usersBuildings.profit as profit,usersBuildings.id as id "
				+ "FROM usersBuildings "
				+ 'JOIN users ON users.id = usersBuildings.users_id '
				+ 'WHERE (lat BETWEEN '+west+' AND ' +east+ ') AND (lng BETWEEN '+south+' AND '+north+') LIMIT 200;';

		pool.query(sql,function(err,result){
			res.send(result);
		})
	}
	
	// get buildings on that make your profit begger 
	//GET: vtype lat lng streetName
	function showBuildingsInArea(res,req){
		var buildingId = req.query.buildingId;
		var vtype = req.query.vtype;
		var lat = parseFloat(req.query.lat);
		var lng = parseFloat(req.query.lng);
		var distance = parseFloat('0.00186');
		var streetName = encodeURI(req.query.streetName);

		if(vtype==1){
			var sql = 'SELECT * '
					+ 'FROM usersBuildings '
					+ 'WHERE street="' + streetName + '" AND (type_id=1 or type_id=2) '
					+ 'LIMIT 30; '
					
					+ 'SELECT * '
					+ 'FROM usersBuildings '
					+ 'WHERE lat<"' + (lat + distance) + '" AND lng<"' + (lng + distance) + '" AND '
					+ 'lat>"' + (lat - distance) + '" AND lng>"' + (lng - distance) + '" AND '
					+ 'lat<>"' + lat + '" AND lng<>"' + lng + '" AND street<>"' + streetName + '" AND (type_id=1 or type_id=2); ';
		}
		else if(vtype==2){
			var sql = 'SELECT * '
					+ 'FROM usersBuildings '
					+ 'WHERE ((lat<"' + (lat + distance) + '" AND lng<"' + (lng + distance) + '" AND '
					+ 'lat>"' + (lat - distance) + '" AND lng>"' + (lng - distance) + '") '
					+ 'OR (street="' + streetName + '"))'
					+ 'AND lat<>"' + lat + '" AND lng<>"' + lng + '" AND type_id=1; '
					
					+ 'SELECT * '
					+ 'FROM usersBuildings '
					+ 'WHERE ((lat<"' + (lat + distance) + '" AND lng<"' + (lng + distance) + '" AND '
					+ 'lat>"' + (lat - distance) + '" AND lng>"' + (lng - distance) + '") '
					+ 'OR (street="' + streetName + '"))'
					+ 'AND lat<>"' + lat + '" AND lng<>"' + lng + '" AND type_id=2; '

					+ 'SELECT * '
					+ 'FROM usersBuildings '
					+ 'WHERE id IN '
						+ '(SELECT other '
						+ 'FROM usersBuildings '
						+ 'WHERE id=' + buildingId + '); '

					+ 'SELECT * '
					+ 'FROM factoryReq '
					+ 'WHERE store_id=' + buildingId + '; '
		}
		else if(vtype==3){
			var sql = 'SELECT * '
					+ 'FROM usersBuildings '
					+ 'WHERE id IN '
						+ '(SELECT other '
						+ 'FROM usersBuildings '
						+ 'WHERE id=' + buildingId + ')'
		}
		else if(vtype==6){
			var sql = 'SELECT * '
				+ 'FROM usersBuildings '
				+ 'WHERE ((lat<"' + (lat + distance) + '" AND lng<"' + (lng + distance) + '" AND '
				+ 'lat>"' + (lat - distance) + '" AND lng>"' + (lng - distance) + '") '
				+ 'OR (street="' + streetName + '"))'
				+ 'AND lat<>"' + lat + '" AND lng<>"' + lng + '" AND type_id=1; '

				+ 'SELECT * '
				+ 'FROM usersBuildings '
				+ 'WHERE ((lat<"' + (lat + distance) + '" AND lng<"' + (lng + distance) + '" AND '
				+ 'lat>"' + (lat - distance) + '" AND lng>"' + (lng - distance) + '") '
				+ 'OR (street="' + streetName + '"))'
				+ 'AND lat<>"' + lat + '" AND lng<>"' + lng + '" AND type_id=6; '

				+ 'SELECT * '
				+ 'FROM usersBuildings '
				+ 'WHERE id IN '
					+ '(SELECT other '
					+ 'FROM usersBuildings '
					+ 'WHERE id=' + buildingId + '); '

				+ 'SELECT * '
				+ 'FROM factoryReq '
				+ 'WHERE store_id=' + buildingId + '; '
		}
		else if(vtype==7){
			var sql = 'SELECT * '
				+ 'FROM usersBuildings '
				+ 'WHERE id IN '
				+ '(SELECT other '
				+ 'FROM usersBuildings '
				+ 'WHERE id=' + buildingId + ')'
		}

		pool.query(sql,function(err,result){
			res.send(result);
		})
	}

	// get geoJson from city name
	function showCity(res,req){
		var country = req.query.country;

		var sql= 'SELECT * FROM citys WHERE country_id="' + country + '";';

		pool.query(sql,function(err,result){
			res.send(result)
		})
	}
}
