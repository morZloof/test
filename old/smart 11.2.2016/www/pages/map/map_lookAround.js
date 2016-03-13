var map_lookAround = new map_lookAroundJs()
function map_lookAroundJs(){
	
	var boolLookAround = 1; // Enable/Disable this fucntion
	this.boolLookAround = boolLookAround;
	function ctor(){
	}
	this.ctor = ctor;

	function showPage(){
	}
	this.showPage;
	function showBuildingsOnTheMap() {
		var cityJson;
		sendCornersToAPI();
		
		// SEND WHEN ZOOM :
		vmap.map.on('zoomend', function() {
			var zoomLevel = vmap.map.getZoom();
			
				vmap.map.eachLayer(function (layer) { // REMOVE ALL LAYERS WITH MARKERS
					if (layer._icon) {		
						vmap.map.removeLayer(layer);
					}

					if (layer.feature) {
						// if (zoomLevel > 15 ) {
						// 	vmap.map.removeLayer(layer);
						// 	cityJson = layer;
						// 	// vmap.arch();
						// }
					}
					
					if (zoomLevel < 15) {
						// var mapLayer; 
						// var userCity = $.globalUserCity[0];
						// if (typeof userCity === "undefined") {
						// 	mapLayer = L.mapbox.featureLayer().addTo(vmap.map);
						// }
						// else {
						// 	mapLayer = L.mapbox.featureLayer().loadURL('/cities/'+userCity.city +'.geojson').addTo(vmap.map);
						// }
						
					}
					
				});
				
				sendCornersToAPI();
		});
		
		// SEND WHEN MOVED
		vmap.map.on('dragend', function() {
			$('.map_cssicon').hide()
			map_relationship.deleteArchLayer();
			if (boolLookAround == 1) {
				sendCornersToAPI();
			}
		});
	}
	this.showBuildingsOnTheMap = showBuildingsOnTheMap;
	
	function sendCornersToAPI() {
		var mapBounds = vmap.map.getBounds()
		var west = mapBounds.getWest();
		var south = mapBounds.getSouth();
		var east = mapBounds.getEast();
		var north = mapBounds.getNorth();

		// SEND TO API
		var data = {
			west: west,
			south: south,
			east: east,
			north: north
			}
			
		var url = "/api/map/showBuildings/"
		global.api(url,data,function(data){
			var json = JSON.parse(data);

			buildBuildings(json)
		})
	}
	this.sendCornersToAPI = sendCornersToAPI;
	
	function buildBuildings(json) {
		if (vmap.map.getZoom() > 15) { // WHEN THE USER IS CLOSE ENOGUH - SHOW ALL BUILDINGS WITH REAL ICONS
			var loopLength = json.length;
			for (var i=0; i < loopLength; i++) {
				var arr = [json[i].lat,json[i].lng];
				
				var buildingType = json[i].type_id;
				var buildingLevel = json[i].level;
				var thisBuilding = buildingsJson.getJson(buildingType);
				var icon;
				
				buildingLevel = buildingLevel - 1;
				thisBuilding = thisBuilding.levels[buildingLevel];
				icon = thisBuilding.img;
				
				vmap.placeMarker(arr,buildingType,icon,thisBuilding,json[i])
			}
		}
		else { //USER IS FAR FAR AWAY - SHOW HIM ONLY HIS BUILDINGS !
			json = $.globalUserBuilding;
			
			var loopLength = json.length;
			for (var i=0; i < loopLength; i++) {
				var arr = [json[i].lat,json[i].lng];
				
				var buildingType = json[i].type_id;
				var buildingLevel = json[i].level;
				var thisBuilding = buildingsJson.getJson(buildingType);
				var icon;
				
				buildingLevel = buildingLevel - 1;
				thisBuilding = thisBuilding.levels[buildingLevel];
				icon = thisBuilding.img;

				vmap.placeMarker(arr,buildingType,icon,thisBuilding,json[i]);
			}
		}
	}
	
	function removeMarkers() {
		vmap.map.eachLayer(function(marker) {
			if (marker._icon) {
				vmap.map.removeLayer(marker);
			}
		});
	}
	this.removeMarkers = removeMarkers;
}
