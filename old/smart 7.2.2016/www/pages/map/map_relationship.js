var map_relationship = new map_relationshipJs()
function map_relationshipJs(){
	function ctor(){
	}
	this.ctor = ctor;
	
	function showPage(lat,lng,streetName,profit,vtype,id) {
        if (typeof id == "undefined") {
            id = null;
        }
        
		var data = {
			lat:lat,
			lng:lng,
			vtype:vtype,
			streetName:streetName,
            buildingId:id

		}

		var url = '/api/map/showBuildingsInArea/';
		
		global.api(url,data,function(data){
			
			var json = JSON.parse(data)

			echomap_relationship(json,profit,lat,lng,vtype);
		})
		

	}
	this.showPage = showPage;
	
	function echomap_relationship(result,profit,lat,lng,buildingType) {
		// START COUNING RESTURNTS AND RESIDENTAL

		var restaurantCount = 0;
		var residentialCount =0;
		
		if (result[0].length > 0) { 
			for (var i=0; i<result[0].length; i++) {
				var type = result[0][i].type_id;
				if (type == 1)
					residentialCount++;
				if (type == 2)
					restaurantCount++;
			}
		}
		if(typeof result[1] != 'undefined') {
            if (result[1].length > 0 ) {
                for (var i=0; i<result[1].length; i++) {
                    var type = result[1][i].type_id;
                    if (type == 1)
                        residentialCount++;
                    if (type == 2)
                        restaurantCount++;
                }						
            }
        }
		
		
		if (buildingType == 1) { // if residental 
			// use formula to know how much every building effects you
			var  residentialEffect = calculateBuildings.residentialVsResidential(residentialCount,profit);
			var  restaurantEffect = calculateBuildings.residentialVsRestaurant(restaurantCount,profit);
			
			setRelationships(result[0],residentialEffect,restaurantEffect,lat,lng);
			setRelationships(result[1],residentialEffect,restaurantEffect,lat,lng);
		}
		else if (buildingType == 2 || buildingType == 6 ) { // if resturant or clothingStore 
			var  residentialEffect = calculateBuildings.restaurantVsResidential(residentialCount,profit);
			var  restaurantEffect = calculateBuildings.restaurantVsRestaurant(result[1],lat,lng,profit);

			setRelationships(result[0],residentialEffect,restaurantEffect,lat,lng);			
			setRelationships2(result[1],restaurantEffect,lat,lng,profit);
            
            console.log(result[2])
            if ((result[2].length > 0) && (typeof result[2] != 'undefined')  ) {
                setWarRelationships(result[2],result[3],profit,lat,lng);
            }
        
		}
		else if (buildingType == 3 || buildingType == 7 ) { // if foodFactor or clothingFactory 
            factoryRelationships(result[0],profit,lat,lng);
		}

				
		
	}
	
	function setRelationships(result,residentialEffect,restaurantEffect,lat,lng) {
		for (var i=0; i<result.length; i++) {
			// GET THE RESULT LAT LNG	
				var type = result[i].type_id;
				if (type == 1) {
					var color = 'green'
					var html = '+' + residentialEffect+'₪'	
				}
				
				if (type == 2) {
					var color = 'green'
					var html = '+' + restaurantEffect+'₪'	
					
				}
				var latlng ={};
				latlng[0] = result[i].lat;
				latlng[1] = result[i].lng;
				if (type == 1 || type == 2) {					
					buildingMarker(latlng, html,color)	
					drawArch(lat,lng,latlng[0],latlng[1],color)
				}
			
		}
	}
	function setRelationships2(result,restaurantEffect,lat,lng,profit) {
		for (var i=0; i<result.length; i++) {
			// GET THE RESULT LAT LNG	
			var type = result[i].type_id;
			var id = result[i].id
			for (var j=0; j<restaurantEffect.length; j++) {
				if (restaurantEffect[j].buildingId == id) {
					var color = 'red'
					var html = '-' + restaurantEffect[j].minus + '₪'
					var latlng ={};
					latlng[0] = result[i].lat;
					latlng[1] = result[i].lng;
					if (type == 1 || type == 2) {
						buildingMarker(latlng, html,color)
						drawArch(lat,lng,latlng[0],latlng[1],color)
					}
				}
			}
		}
	}
	
    function factoryRelationships(store,profit,lat,lng) {
        var color = 'green'
        var html = '+'+profit+'₪'	
        var latlng ={};
        latlng[0] = store.lat;
        latlng[1] = store.lng;			
        buildingMarker(latlng, html,color)	
        drawArch(lat,lng,latlng[0],latlng[1],color)
    }
    
	
    function setWarRelationships(factory,bid,profit,lat,lng) {
        var efect = formulas.factoryCalculate(factory[0].level,profit);
        var total = efect - bid[0].bid;
        var color = 'green'
        var html = '+'+total+'₪'	
        var latlng ={};
        latlng[0] = factory[0].lat;
        latlng[1] = factory[0].lng;			
        buildingMarker(latlng, html,color)	
        drawArch(lat,lng,latlng[0],latlng[1],color)
    }
    
	function buildingMarker(latlng, html,color) {
		if (color == 'green') {			
			var cssIcon = L.divIcon({
				// Specify a class name we can refer to in CSS.
				className: 'map_cssicon',
				html: html,
				// Set marker width and height
				iconSize: [100, 30]
			});
		}
		else {			
			var cssIcon = L.divIcon({
				// Specify a class name we can refer to in CSS.
				className: 'map_cssicon map_cssicon2',
				html: html,
				// Set marker width and height
				iconSize: [100, 30]
			});
			
		}

		L.marker([latlng[1], latlng[0]], {icon: cssIcon}).addTo(vmap.map);
	}
	
	function drawArch(buildingLat, buildinglng, reultLat,resultLng,color ) {
		var archLayer = L.mapbox.featureLayer();
		var start = { x: buildingLat, y: buildinglng };
		var end = { x: reultLat,y: resultLng  };
		var generator = new arc.GreatCircle(start, end);
		var line = generator.Arc(60, { offset: 10 });
		
		L.geoJson(line.json(), {color: color}).addTo(archLayer);
		archLayer.addTo(vmap.map)


	}
	
	function deleteArchLayer() {	
		vmap.map.eachLayer(function(layer) { 
			if (!(layer._popupContent) && !(layer._icon) && (layer._latlngs))
				vmap.map.removeLayer(layer);
		});	
		
	}
	this.deleteArchLayer = deleteArchLayer;
}
