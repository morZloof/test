var map_findStreetName = new map_findStreetNameJs()
var geocoder;
var map;
var infowindow;
function map_findStreetNameJs(){
	function ctor(){
		
	}
	this.ctor = ctor;

	function showPage(){

	}
	
	function initMap() {
		// THIS FUNCTION is BEEN CALLED FROM INDEX
		var map = new google.maps.Map(document.getElementById('map_googleMaps'), {
			center: {lat: 40.731, lng: -73.997},
			zoom: 8,
    		mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		
		var input = document.getElementById('map_searchBox_locations');

		var searchBox = new google.maps.places.SearchBox(input);
		
		searchBox.addListener('places_changed', function() {
			var places = searchBox.getPlaces();
			if (places.length == 0) {
			return;
		}
    
		places.forEach(function(place) {
			vmap.zoomToMainBuilding(place.geometry.location.lat(),place.geometry.location.lng())
		});
 	 });
		
		geocoder = new google.maps.Geocoder;
		infowindow = new google.maps.InfoWindow;
		this.geocoder = geocoder;
		this.map = map;
		this.infowindow = infowindow;
		
	}
	this.initMap = initMap;
	
	function geocodeLatLng(geocoder, map, infowindow, latlngStr, buildingType, icon) {
		var buildingJson = buildingsJson.getJson(buildingType)
		// THIS FUNCTION is BEEN CALLED FROM MAP.JS
		var latlng = {lat: parseFloat(latlngStr[1]), lng: parseFloat(latlngStr[0])};
		geocoder.geocode({
			'location': latlng
			}, function(results, status) {
			if (status == 'OK') {

				if (results[0].types[0] == 'street_address') {
					var streetJsonText = JSON.stringify(results[0].address_components);
					vmap.buildingMarker(latlngStr,buildingType,icon,streetJsonText)
				}
				else {
					vmap.buildingMarker(latlngStr,buildingType,icon,-1);
				}
				
			}
			else {
                console.log(results[0].types[0])
                
				$('#map_streetName').val();
				$('#map_clickedLatLng').val()
				valert.showPage('אי אפשר לבנות כאן');	
				vmap.buyHouseAlert(icon,buildingType, buildingJson.levels[0].price)
			}
		});
	}
	this.geocodeLatLng = geocodeLatLng;
}
