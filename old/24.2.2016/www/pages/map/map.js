var vmap = new vmapJs()
function vmapJs(){

	var map; // The Map Itself
	function ctor(userCity){
		var mapLayer; //the Map Layer
		var geoJsonData; //relevent map geojson data;
		var streetLayer; //The layer that prints the Streets geoJson
		
		addMap(userCity); //Add map to project
        
	    $('.map_randomClient_cancel').click(closeFlow)
        $('.map_randomClient_search').click(war.getRandomRresutrant)
		$(".map_larger").click(makeMapLarger);
		$(".map_smaller").click(makeMapSmaller);
		$(".map_zoomToMain").click(zoomToMainBuildingHelper);
	}
	this.ctor = ctor;
	function showPage(){
		$(".global_page_notebook").hide();
		$(".global_page_map").show();
		
		if(typeof map != 'undefined') {
			setTimeout(function(){
				map._onResize(); 
			},500)
		}
	}
	this.showPage = showPage;

	function addMap(userCity) { //Add map to project
		
		L.mapbox.accessToken = 'pk.eyJ1Ijoia3lkb3MiLCJhIjoiZDA3OGZlZmIzOGMxOGEwZDg5OTRkNzYzNWM5MjQ0OTUifQ.DvOaW0Br9Ulgv0u11h1inw';
		map = L.mapbox.map('mapbox', 'kydos.e6192ac7').setView([32.085300, 34.781668], 13);
		setMapBounds();
		
    	if (typeof userCity === "undefined") {
			mapLayer = L.mapbox.featureLayer().addTo(map);
		}
		else {
    		// mapLayer = L.mapbox.featureLayer().loadURL('/cities/'+userCity.city +'.geojson').addTo(map);
			mapLayer = L.mapbox.featureLayer().addTo(map);
		
        }
		vmap.map = map;
	}

	function chooseCity() { // Choosing Streets
   		map.setView([31.8297, 34.9717], 9);
			addCitiesGeoJson();
	}
	this.chooseCity = chooseCity;

	function addCitiesGeoJson() {
		//TODO: 1. send country
		//		2. get geojson relevent to the coutnry
		//*******************************************//
		//TODO1: get the geojson of israel cities from API -
		  getDataFromJson();
	}

	function getDataFromJson() {
		
		var data = {country: 1}
			
		var url = "/api/map/showCity/"
		global.api(url,data,function(data){
			var json = JSON.parse(data);
			var arr = new Array();
			setJsonOnLayer(json.length,json,arr);
		})
	}

	function setJsonOnLayer(size, json, arr) {
		for(var i =0; i<size; i++) {
			arr[i]= L.mapbox.featureLayer()
		}
		for(var i =0; i<size; i++) {
			var temp = JSON.parse(json[i].geoJson);
    	 	arr[i].setGeoJSON(temp);
		 	arr[i].addTo(map);
		  	getChoosenGeoJson(arr[i]);
		}
	}
	function getChoosenGeoJson(geoJsonLayer) { 
		//Check what geojson the user clicked and gets his data
		//TODO2: find out what data to send to api -
		geoJsonLayer.on('click', function(e) {
			var geoJsonfeatures = e.target._geojson.features;
			var clickedLatLng = e.latlng;
			changeZoomToCityLevel(clickedLatLng, geoJsonLayer);
		});
	}

	function changeZoomToCityLevel(clickedLatLng,geoJsonLayer) { // zoom in to the city and change the geojson style
   		map.setView([clickedLatLng.lat, clickedLatLng.lng], 15);
		var geoJsonData = geoJsonLayer._geojson;
		geoJsonData.features[0].properties.fill = 'none';
		geoJsonData.features[0].properties.stroke = '#FF0000';
		geoJsonLayer.setGeoJSON(geoJsonData);
		notebook.addCity(geoJsonData.features[0].properties.name)
	}

	function buyStreets() {
		$('.map_controls_searchInput').fadeIn();
		searchPlaceByForm();
	}
	this.buyStreets = buyStreets;

	function searchPlaceByForm() {
		$('#map_searchInput').bind("enterKey",function(e){
			var val = $('#map_searchInput').val();
			sendStreetNameToAPI(val);
		});
		$('#map_searchInput').keyup(function(e){
			if(e.keyCode == 13)
			$(this).trigger("enterKey");
		});
	}

	function sendStreetNameToAPI(val) {
		
		var data = {
			country: 1,
			street: val
		}
			
		var url = "/api/map/showStreet/"
		global.api(url,data,function(data){
			var json = JSON.parse(data);
			getStreetData(json)
		})
	}
	function getStreetData(json) {
		var streetId = json[0].id;
		$('.map_userStreetID').text(streetId);
		var streetGeoJson = JSON.parse("["+ json[0].geoJson +"]");
		for (var i=0; i<streetGeoJson.length; i++) {
			streetGeoJson[i].properties['stroke-width'] = "5";
		}
		drawStreetGeoJson(streetGeoJson);
		confirmBuy(json[0].street);
	}

	function drawStreetGeoJson(streetGeoJson) {
		console.log(streetGeoJson)
		streetLayer = L.mapbox.featureLayer();
		streetLayer.setGeoJSON(streetGeoJson);
		streetLayer.addTo(map);
		
		$('.StreetGeoJson').text(streetGeoJson);
		streetLayer.on('click', function(e) {
			var geoJsonfeatures = e.layer.feature;
			addHouseIcon(geoJsonfeatures);
		});
		zoomToStreet(streetGeoJson);
	}
	this.drawStreetGeoJson = drawStreetGeoJson;
	
	function confirmBuy(streetName) {
		var r = confirm('לקנות את רחוב ' +streetName+'?' );
		if (r==true) {
			alert ("קנית")
			sendStreetToAPI();
		}
		else {
			alert("לא קנית")
		}
	}
	function zoomToStreet(streetGeoJson) {
		var y = streetGeoJson[0].geometry.coordinates[0][0];
		var z = streetGeoJson[0].geometry.coordinates[0][1];
   		map.setView([z, y], 16);
	}
	
	function buyHouseAlert(icon,buildingType, price) {
		deleteCityGeoJson();
		
		//TODO: 
		// 1. MAKE MAP LARGER
		makeMapLarger();
		// 2. SHOW NOTE !
		showNote();
		
		
		var mainBuilding = buildingsJson.getMainBuilding();
		// if (typeof (mainBuilding == "undefined")) {
		if ( (mainBuilding == "0")) {
 		   // THIS HAPPENDS IN THE MENTOR FLOW. 
			// TODO: CHECK IF YOU NEED TO ZOOM TO TEL AVIV OR JERUSLAEM 
			// OR ANY OTHER CITY
			var userCity = $.globalUserCity[0].city;
			if (userCity == 'telAviv') {
				zoomToRandomPointInTA();
			}
			if (userCity == 'jerusalem') {
				zoomToRandomPointInJerusalem();
			}
			
			// zoomToMainBuilding(32.1130649,34.8025055, 15)	
		}
		else {
			// ZOOM TO MAIN BUILDING
		}
		
		// 3. CLOSE FLOW
		
		
		var latlng ={};
		var click = document.getElementById('click');
		var times = 0;
		var finishFunction1 = 0;
		var finishFunction2 = 0;
        
		map.on('click', function(e) {
			var filter = $('.leaflet-popup-content').css('width');
			if (typeof filter === "undefined") {
                    latlng[1] = e.latlng.lat;
                    latlng[0] = e.latlng.lng;
                    finishFunction1 = 1;
                    finish()
			}
		});

		var canBuild = map_click.canBuild;
		// $('.map img').mousemove(function(e){
		//   var div = this;
		//   var theE = e;

		// 	map_click.mapClickWorking(theE,div,function(result){
		// 	  // clearInterval(myVar);

		// 		canBuild = result;
		// 		if(result==1){
		// 			finishFunction2 = 1;
		// 			finish()
		// 		}
		// 		else {
		// 			// valert.showPage('אי אפשר לבנות על כבישים!')
		// 			finishFunction2 = 0;
		// 		}

		// 	});
		// });
        
        function finish() {
            finishFunction2 = checkCursorStat();
            if (finishFunction2 == 0) {
                // valert.showPage('אי אפשר לבנות על כבישים!')
                $('.curser_tail_text').show();
            }
            if (times == 0 && finishFunction1 == 1 && finishFunction2 == 1) {
                $('.curser_tail_text').hide()
                map_findStreetName.geocodeLatLng(map_findStreetName.geocoder, map_findStreetName.map, map_findStreetName.infowindow, latlng, buildingType, icon)
                times++;
                map_click.stopChecking();
            }
        }
	}
    
	this.buyHouseAlert = buyHouseAlert;

    function checkCursorStat() { // This function checks if you can BUILd 
        var curserBorder = $('#curser_tail_noEntrence').css('display');
        if (curserBorder == 'block') {
            return 0;
        }
        else {
            return 1 ;
        }
    }
	function buildingMarker(latlng,buildingType,icon,streetJsonText) {
		var streetJson = JSON.parse(streetJsonText);
        if (streetJsonText == '-1') {
             var streetName = '-1'
        }
        else {
		  var streetName = encodeURIComponent(streetJson[1].long_name);
        }
		var buildingJson = buildingsJson.getJson(buildingType);
		
		var zoomLevel = map.getZoom();
		var buildingLayer = L.mapbox.featureLayer();
		var buildingIconGeoJson = [{
				"type": "Feature",
				"geometry": {
				"type": "Point",
				"coordinates": [latlng[0], latlng[1]]
				},
				"properties": {
				"title": buildingType,
				"icon": {
					"iconUrl": icon,
					"iconSize": [4*zoomLevel, 4*zoomLevel]
					}
				}
			}];
			
			buildingLayer.on('layeradd', function(e) {
				var marker = e.layer,
				feature = marker.feature;
				marker.setIcon(L.icon(feature.properties.icon));
				
			});
			
			buildingLayer.setGeoJSON(buildingIconGeoJson);
			buildingLayer.addTo(map);
			if (buildingType == 1 || buildingType == 2 || buildingType == 6 || buildingType == 3 || buildingType == 7 )
				map_relationship.showPage(latlng[0],latlng[1],streetName,buildingJson.levels[0].profit, buildingType)
			
			var buildingJson = buildingsJson.getJson(buildingType)
			var popup = ''
					+	'<div class="map_popup">'
					+		'<div class="map_popup_buildingID">' + buildingsJson.getBuildingName(buildingType) +'</div>'
					+		'<h2>' + 'האם אתה רוצה לבנות?' + '</h2>'
					+		'מחיר: ' + help.addComma(buildingJson.levels[0].price) + '<br>'
					+		'זמן סיום: ' + buildingsJson.getTime(buildingType,1) + '<br>'
					+		'<div class="map_popup_approve">קנה</div>'
					+		'<div class="map_popup_cancel">בטל</div>'
					+	'</div>';
					
			buildingLayer.bindPopup(popup,{
     		   closeButton: false,
				closeOnClick: false
   			 });
			buildingLayer.openPopup();
			
			buildingLayer.on('popupclose', function() {
				buildingLayer.bindPopup(popup,{
					closeButton: false,
						closeOnClick: false
					});
				buildingLayer.openPopup();
			})
			map.setView([latlng[1], latlng[0]]); // zoomToBulding
			
			if (map.tap) map.tap.disable();
			map.boxZoom.disable();
			map.keyboard.disable();
			$(".leaflet-control-zoom").css("visibility", "hidden");
			
			map.dragging.disable();
			map.touchZoom.disable();
			map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();
			$('.map_note').hide();
			
			//BIND BUY BTN:
			$('.map').off('click', '.map_popup_approve')
			$('.map').on('click', '.map_popup_approve', function() {
				
				map_relationship.deleteArchLayer();
				$('.map_cssicon').hide()
				// VALIDATION: IF THIS IS THE USER CITY:
				var userCity = $.globalUserCity[0];

					$.getJSON('/cities/'+userCity.city +'.geojson', function(json) {
						var gjLayer = L.geoJson(json);
						var results = leafletPip.pointInLayer([latlng[0], latlng[1]], gjLayer);
						if (results.length) {
								map.removeLayer(buildingLayer);
								closeFlow();
								sendHouseToApi(latlng,buildingType, streetJsonText,function(data){				
									if (data == 'error: you dont have enough office level') {
										valert.showPage('ניתן לבנות רק מבנה אחד בכל זמן נתון')
									}
									else if (data == 'error: you dont have money'){
										valert.showPage('אין לך מספיק כסף')									
									}
									else {
										placeMarker(latlng,buildingType,icon);					
									}
								});
						}
						else {
                            var userCity = $.globalUserCity;
                            var cities ='';
                            
                            for (var i=0; i<userCity.length; i++) {
                                cities += setCitiesNames(userCity[i].city);
                            }
                            
                            var text = 'אי אפשר לבנות מחוץ לעיר שלך!  אתה יכול לבנות ב'+cities+' '
							valert.showPage(text);
							map.removeLayer(buildingLayer);
							continueFlow();
							buyHouseAlert(icon,buildingType,buildingJson.levels[0].price);
                            $('.map_cssicon').hide()
                            zoomToMainBuildingHelper();
                            map_click.startChecking(icon)
							
						}
					});
				// }
			});
			
			// BIND CANCEL BTN:
			$('.map').off('click', '.map_popup_cancel')
			$('.map').on('click', '.map_popup_cancel', function() {
				map.removeLayer(buildingLayer);
				continueFlow();
				buyHouseAlert(icon,buildingType,buildingJson.levels[0].price);
				map_relationship.deleteArchLayer();
                map_click.startChecking(icon)
				$('.map_cssicon').hide()
			});
			
			
	}
	this.buildingMarker = buildingMarker;
	
	function closeFlow() {
        map_click.stopChecking();
		makeMapSmaller();
		map.closePopup();

		map.boxZoom.enable();
		map.keyboard.enable();
		$(".leaflet-control-zoom").css("visibility", "show");
		if (map.tap) map.tap.enable();
		map.dragging.enable(); 
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();

		map.on('click', function(e) {

		});
		
	}
	this.closeFlow = closeFlow
	function continueFlow() {
		map_lookAround.showBuildingsOnTheMap();
		$('.map_note').show();
		map.closePopup();
		
		map.boxZoom.enable();
		map.keyboard.enable();
		$(".leaflet-control-zoom").css("visibility", "show");
		if (map.tap) map.tap.enable();
		map.dragging.enable(); 
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
		
	}
	this.continueFlow = continueFlow;
	
	function markerSize(zoom){
		var minus = 20 - zoom
		
		if(zoom == 19){
			var zoomPx = 100;
		}
		else{
			var zoomPx = 100 / minus;
		}		
		
		return zoomPx;
	}
	this.markerSize = markerSize;
	function placeMarker(latlng,buildingType,icon,building,json) {
        
        // CHECK IF YOU HAVE FACTORY 
        var factoryValid = 0;
        var userBuildings = $.globalUserBuilding;
        
        for (var i=0; i< userBuildings.length; i++) {
            if (userBuildings[i].type_id == '3' || userBuildings[i].type_id == '7' ) {
                factoryValid = 1;
            }
        }
        
	  	var newBuilding = 1;
		var markers = [];
		map.eachLayer(function(marker) { markers.push(marker); });
		
		for (var i=0; i<markers.length; i++) {
			if(typeof markers[i]._latlng != 'undefined') {
				 var m = markers[i].getLatLng();
				 
				 if (latlng[1] == m.lat && latlng[0] == m.lng)
				 	newBuilding = 0;
			}
		}
		if (newBuilding) {
			var zoomLevel = map.getZoom();
			var buildingLayer = L.mapbox.featureLayer();
			var markerPx = markerSize(zoomLevel)
            
			if (zoomLevel > 15) {
				var buildingIconGeoJson = [{
					"type": "Feature",
					"geometry": {
					"type": "Point",
					"coordinates": [latlng[0], latlng[1]]
					},
					"properties": {
					"title": buildingType,
					"icon": {
						"iconUrl": icon,
						"iconSize": [markerPx, markerPx]
						}
					}
				}];
				buildingLayer.on('layeradd', function(e) {
					var marker = e.layer,
					feature = marker.feature;
					marker.setIcon(L.icon(feature.properties.icon));
					
				});
				buildingLayer.setGeoJSON(buildingIconGeoJson);
				buildingLayer.addTo(map);	
			} 
			else if ((typeof json != 'undefined') && (json.users_id == $.globalUser.id) )
			{
				var buildingIconGeoJson = [{
					"type": "Feature",
					"geometry": {
					"type": "Point",
					"coordinates": [latlng[0], latlng[1]]
					},
					"properties": {
					"title": buildingType,
               		 'marker-color': '#000'
					}
				}];
				
				buildingLayer.setGeoJSON(buildingIconGeoJson);
				buildingLayer.addTo(map);	
			}
			
			if (json === undefined) {// WHEN THE BUILDING IS BEEING BUILD 
					var popup = ''
					+	'<div class="map_popup">'
					+		'<div class="map_popup_buildingID"></div>'
					+		'<h2> הבית בבנייה </h2>'
					+	'</div>';
					
					buildingLayer.bindPopup(popup); 
				
			}
			// WHEN SHOWING AND NOT BUILDING
			if ((typeof json != 'undefined') && (json.users_id == $.globalUser.id) ) // THIS BUILDING BELONGS TO THE USER! 
			{
				
				if(typeof json != 'undefined') {
					if (json.inBuild  == '0') { // ITS NOT IN BUILD!						
						//TOOLTIP HTML:
						var buildingName = buildingsJson.getBuildingName(json.type_id );
                        if (json.street == -1) {
                            json.street = 'ללא רחוב';
                        }
						if ( (validClient(json.type_id)) && (factoryValid) ) { // IF ITS validClient && USER HAVE FACTORY
                            
                            var popup = ''
                            +	'<div class="map_popup">'
                            +		'<div class="map_popup_buildingID" style="display:none">' + json.id +'</div>'
                            +		'<h2>' + buildingName + '</h2>'
                            +		'רמה: ' + json.level + '<br>'
                            +		'רווח: ' + help.addComma(json.profit) + '<br>'
                            +		'רחוב: ' + decodeURIComponent(json.street) + '<br>'
                            +		'<div class="map_popup_upgradeBtn">שדרג</div>'
						    +		'<div class="map_popup_resturantFactoryWar">רכוש לקוח</div>'
                            +	'</div>';
                            
                        }
                        
                        else {
                            var popup = ''
                            +	'<div class="map_popup">'
                            +		'<div class="map_popup_buildingID" style="display:none">' + json.id +'</div>'
                            +		'<h2>' + buildingName + '</h2>'
                            +		'רמה: ' + json.level + '<br>'
                            +		'רווח: ' + help.addComma(json.profit) + '<br>'
                            +		'רחוב: ' + decodeURIComponent(json.street) + '<br>'
                            +		'<div class="map_popup_upgradeBtn">שדרג</div>'
                            +	'</div>';
                            
                        }

                        
                        if(($.globalUser.mentor==10) && (validClient(json.type_id)) ) { // KEEP USER FOCUES IN MENTOR
                            buildingLayer.bindPopup(popup,{
                            closeButton: false,
                                closeOnClick: false
                            });
                            
                            buildingLayer.on('popupclose', function() {
                                buildingLayer.bindPopup(popup,{
                                    closeButton: false,
                                        closeOnClick: false
                                    });
                                buildingLayer.openPopup();
                            })  
                        }   
                                                
                        if(($.globalUser.mentor==7) && (json.type_id == 0)) { // KEEP YOU IN FLOW
                            buildingLayer.bindPopup(popup,{
                            closeButton: false,
                                closeOnClick: false
                            });
                            
                            buildingLayer.on('popupclose', function() {
                                buildingLayer.bindPopup(popup,{
                                    closeButton: false,
                                        closeOnClick: false
                                    });
                                buildingLayer.openPopup();
                            })  
                        }                     
                        // SET CIRCLE 
                        
                        var html = '<div class="map_userCircle_child"></div>'
                        var latlng ={};
                        latlng[0] = json.lat;
                        latlng[1] = json.lng;		
                        var cssIcon = L.divIcon({
                            className: 'map_userCircle_father',
                            html: html,
                            iconSize: [20, 20]
                        });
                        
                        var father_zindex = $(".map_userCircle_father").css('z-index');
                        $(".map_userCircle_father").css('z-index', father_zindex-1);
                        
                        L.marker([latlng[1], latlng[0]], {icon: cssIcon}).addTo(vmap.map);
                        setCircleSize(markerPx);
                        					
                        if (checkIfCanUpgrade(json)) {
                            var html = '▲'
                            var latlng ={};
                            latlng[0] = json.lat;
                            latlng[1] = json.lng;		
                            var cssIcon = L.divIcon({
                                // Specify a class name we can refer to in CSS.
                                className: 'map_cssupgrade',
                                html: html,
                                // Set marker width and height
                                iconSize: [20, 20]
                            });
	                      	L.marker([latlng[1], latlng[0]], {icon: cssIcon}).addTo(vmap.map);
                            setUpgradeSize(markerPx);
                        }
                        
						buildingLayer.bindPopup(popup);
						buildingLayer.on('click', function(e) {
							$('.map_cssicon').hide()
							map_relationship.deleteArchLayer();
							if ($('.leaflet-popup-content').is(':visible')) {
								if (json.type_id == 1 || json.type_id == 2 || json.type_id == 6 || json.type_id == 3 || json.type_id == 7)
									map_relationship.showPage(json.lat, json.lng, json.street, json.profit, json.type_id, json.id)
							}
							else {								
								$('.map_cssicon').hide()
								map_relationship.deleteArchLayer();
							}
						});

						
						//for mentor
						buildingLayer.on("click",function(e){
							if($.globalUser.mentor==7){
								clearInterval($.addBuilding_mentorLevel5);
								clearInterval($.addBuilding_mentorLevel5_1);
								$(".map_mentor_level5").hide();
								
								$.addBuilding_mentorLevel5_1 = setInterval(function(){
									$(".map_mentor_level5_1").fadeToggle(100)
								},500)
							}
						})
						
                        // FACTORY FIGHTS FOR RESTURANT - WAR
                        // $('.map').off('click', '.map_popup_resturantFactoryWar')
                        // $('.map').on('click', '.map_popup_resturantFactoryWar', function() {
                        //     war.factoryForResturant(json);
                        //     console.log(json)
                        // });
                        
						$('.map').off('click', '.map_popup_upgradeBtn')
						$('.map').on('click', '.map_popup_upgradeBtn', function() {
							var div = $(this);
							
							clearInterval($.addBuilding_mentorLevel5_1);
							$(".map_mentor_level5_1").hide()
							
							if($.globalUser.mentor==7){
								$.addBuilding_mentorLevel5_3 = setInterval(function(){
									$(".upgradeBuilding_holder_level5_3").fadeToggle(100)
								},500)
							}
							
							upgradeBuildingFunction(div);
						});
					}
					else { // ITS IN BUILDING PROCESS

							var buildingName = buildingsJson.getBuildingName(json.type_id );
							var buildingProcess = $.globalUserOnBuildingProcess;
							var buildingEndTime;
                            if (json.street == -1) {
                                json.street = 'ללא רחוב';
                            }
							
							for (var i=0; i<buildingProcess.length; i++) {
								if (buildingProcess[i].usersBuildings_id == json.id) {
										buildingEndTime = 	buildingProcess[i].dateEnd;
								}
							}

							
                            if ((json.type_id == 2) && (factoryValid == 1) ) { 
                                var popup = ''
                                +	'<div class="map_buildingProcess">'
                                +       '<div class="map_popup_userID" style="display:none">' + json.users_id +'</div>'
                                +		'<div class="map_popup_buildingID" style="display:none">' + json.id +'</div>'
                                +		'<h2>!בבניה</h2>'
                                +		'<h2>' + buildingName + '</h2>'
                                +		'' + decodeURIComponent(json.street) + ' :רחוב <br>'
                                +		'<div class="map_popup_resturantFactoryWar">רכוש לקוח</div>'
                                +	'</div>';    
                            }
                            else {
                                var popup = ''
                                +	'<div class="map_buildingProcess">'
                                +       '<div class="map_popup_userID" style="display:none">' + json.users_id +'</div>'
                                +		'<div class="map_popup_buildingID" style="display:none">' + json.id +'</div>'
                                +		'<h2>!בבניה</h2>'
                                +		'<h2>' + buildingName + '</h2>'
                                +		'' + decodeURIComponent(json.street) + ' :רחוב <br>'
                                +	'</div>';                                
                            }
                            
                            if(($.globalUser.mentor==10) && (validClient(json.type_id)) ) { // KEEP USER FOCUES IN MENTOR
                                buildingLayer.bindPopup(popup,{
                                closeButton: false,
                                    closeOnClick: false
                                });
                                
                                buildingLayer.on('popupclose', function() {
                                    buildingLayer.bindPopup(popup,{
                                        closeButton: false,
                                            closeOnClick: false
                                        });
                                    buildingLayer.openPopup();
                                })  
                            }   							
                            // FACTORY FIGHTS FOR RESTURANT - WAR
                            $('.map').off('click', '.map_popup_resturantFactoryWar')
                            $('.map').on('click', '.map_popup_resturantFactoryWar', function() {
                                war.factoryForResturant(json);

                            });							
							buildingLayer.bindPopup(popup);
							
					}
				}
			}
			else 
			{
				if(typeof json != 'undefined') { // THIS buILDiNG BELONGS TO ANOTHER USER
					//TOOLTIP HTML:
					var companyName = json.companys_name;
					
					if (companyName == null) {
						companyName = '';
					}
                    if (json.street == -1) {
                        json.street = 'ללא רחוב';
                    }

					if ((json.type_id == 2) && (factoryValid == 1) ) {
						var popup = ''
						+	'<div class="map_popup">'
                        +       '<div class="map_popup_userID" style="display:none">' + json.users_id +'</div>'
						+		'<h2>' + buildingsJson.getBuildingName(json.type_id) + '</h2>'
						+		'רמה: ' + json.level + '<br>'
						+		'רווח: ' + help.addComma(json.profit) + '<br>'
						+		'רחוב: ' + decodeURIComponent(json.street) + '<br>'
						+		'<div class="map_popup_resturantFactoryWar">רכוש לקוח</div>'
						+		'<div class="map_popup_showUserBtn">' + json.userName + '</div>'
								if (companyName.length > 0)
						+			'<div class="map_popup_showClanBtn">' + companyName + '</div>'
						+	'</div>';
						
                        // FACTORY FIGHTS FOR RESTURANT - WAR
                        $('.map').off('click', '.map_popup_resturantFactoryWar')
                        $('.map').on('click', '.map_popup_resturantFactoryWar', function() {
                            war.factoryForResturant(json);

                        });
					}
					else {
						var popup = ''
						+	'<div class="map_popup">'
                        +       '<div class="map_popup_userID" style="display:none">' + json.users_id +'</div>'
						+		'<h2>' + buildingsJson.getBuildingName(json.type_id) + '</h2>'
						+		'רמה: ' + json.level + '<br>'
						+		'רווח: ' + help.addComma(json.profit) + '<br>'
						+		'רחוב: ' + decodeURIComponent(json.street) + '<br>'
						// +		'<div class="map_popup_bidBtn">בקש לרכוש</div>'
						+		'<div class="map_popup_showUserBtn">' + json.userName + '</div>'
								if (companyName.length > 0)
						+			'<div class="map_popup_showClanBtn">' + companyName + '</div>'
						+	'</div>';
						
					}
                    if(($.globalUser.mentor==10) && (validClient(json.type_id)) ) { // KEEP USER FOCUES IN MENTOR
                        buildingLayer.bindPopup(popup,{
                        closeButton: false,
                            closeOnClick: false
                        });
                        
                        buildingLayer.on('popupclose', function() {
                            buildingLayer.bindPopup(popup,{
                                closeButton: false,
                                    closeOnClick: false
                                });
                            buildingLayer.openPopup();
                        })  
                    }  
                     					
					buildingLayer.bindPopup(popup);
					buildingLayer.on('click', function(e) {		
						map_relationship.deleteArchLayer();
						$('.map_cssicon').hide()
					});
					
					$('.map').off('click', '.map_popup_showUserBtn')
					$('.map').on('click', '.map_popup_showUserBtn', function() {
                        var userId = $(this).parent().find('.map_popup_userID').text();
                        console.log($(this).parent())
						profile.showPage(userId);
                        
					});
					
					$('.map').off('click', '.map_popup_showClanBtn')
					$('.map').on('click', '.map_popup_showClanBtn', function() {
						showPage.showPage(json.companys_id)
					});
				}
			}
			
			if (json == 'undefined') { // HOUSE IS STILL BUILDING

				var popup = ''
				+	'<div class="map_popup">'
				+		'<div class="map_popup_buildingID">הבניין עדיין לא מוכן</div>'
				+	'</div>';
				
				buildingLayer.bindPopup(popup);
			}
		}
		
		
  }
  this.placeMarker = placeMarker;
  
  function sendStreetToAPI() {
	  var streetName = $('#map_streetName').val();
	  if (streetName.length > 0) {
	  var streetID = $('.map_userStreetID').text();
		var data = {country: 1}
		var url = "/api/buy/addStreet//?cityId=2&cityName=telAviv&streetId="+streetID+""
		global.api(url,data,function(data){
			var json = JSON.parse(data);
			notebook.getData();
			map_lookAround.showBuildingsOnTheMap();
		})
	  }
	}
	
	
	function sendHouseToApi(latlng,buildingType,streetJsonText,callback) {
		// IF ITS COMAPNY - SEND TO ADD COMPANY API
		//if (buildingType == 3) {
		//	sendToAddCompanyAPI(latlng);
		//	return;
		//}
		
		var streetJson = JSON.parse(streetJsonText);
		
		var streetNumber;
		var streetName;
		var cityName;
		var DistrictName;
		var CountryName
        if (streetJsonText == '-1') {
            streetNumber = '-1';
            streetName = '-1';
            cityName = '-1';
            DistrictName = '-1';
            CountryName = '-1';
            
        }
        else {
            streetNumber = encodeURIComponent(streetJson[0].long_name);
            streetName = encodeURIComponent(streetJson[1].long_name);
            cityName = encodeURIComponent(streetJson[2].long_name);
            DistrictName = encodeURIComponent(streetJson[3].long_name);
            CountryName = encodeURIComponent(streetJson[4].long_name);
        }

		if(buildingType==4){
			var companyName = $('.company_new_holder_input_companyName').val()
			var data = {
				companyName: companyName,
				streetNumber: streetNumber,
				streetName: streetName,
				cityName: cityName,
				DistrictName: DistrictName,
				CountryName: CountryName,
				vtype: buildingType,
				lat: latlng[0],
				lng: latlng[1]
			}
		}
		else{
			var data = {
				streetNumber: streetNumber,
				streetName: streetName,
				cityName: cityName,
				DistrictName: DistrictName,
				CountryName: CountryName,
				vtype: buildingType,
				lat: latlng[0],
				lng: latlng[1]
			}
		}

		var url = "/api/buy/addNewBuilding/"
		global.api(url,data,function(data){
			callback(data);

			var mentorLevel = $.globalUser.mentor

			if(mentorLevel==2){
				mentor.finishLevel2()
			}
			if (mentorLevel==3){
				mentor.finishLevel3()
			}
			else if (mentorLevel==5){
				mentor.finishLevel5()
			}
			else if (mentorLevel==7){
				mentor.finishLevel7()
			}
	        else if (mentorLevel==8){
				mentor.finishLevel8()
			}
             
			global.getUser()
		})
	}
	this.sendHouseToApi = sendHouseToApi;
	
    function zoomToMainBuildingHelper() {
        var mainBuilding = buildingsJson.getMainBuilding();
        zoomToMainBuilding(mainBuilding.lng,mainBuilding.lat, 18)	
    }
    
	function zoomToMainBuilding(z,y) {
		map._onResize();
		map.setView([z, y], 18);
        map_lookAround.sendCornersToAPI();
	}
	this.zoomToMainBuilding = zoomToMainBuilding;
	
	function disableMove(){
			if (map.tap) map.tap.disable();
			map.boxZoom.disable();
			map.keyboard.disable();
			$(".leaflet-control-zoom").css("visibility", "hidden");
			
			map.dragging.disable();
			map.touchZoom.disable();
			map.doubleClickZoom.disable();
			map.scrollWheelZoom.disable();
			$('.map_note').hide();
	}
	this.disableMove = disableMove;
	
	function upgradeBuildingFunction(div) {
		var buildingId = div.parent().find('.map_popup_buildingID').text();
		upgradeBuilding.showPage(buildingId);
	}
	
    
	function makeMapLarger() {
        $(".runningTimes").addClass('runningTimes_addClassFromMap');
        
		$(".map_larger").hide();
		$(".map_smaller").show();
		$('.map_searchBox').show();
		$('.map_searchBox').attr("placeholder", "חפש כתובת");
		$(".map_goToNotebook").hide()
	   
		$(".global_page_map").css("-webkit-filter","blur(0px)");

        
        $('.notebookNav').hide();
		addBuilding.moveDown()
		
		$(".map").addClass("mapLarger");
		
		setTimeout(function(){
			map._onResize(); 
		},100)
		
		setTimeout(function(){
			map._onResize(); 
		},200)
		
		setTimeout(function(){
			map._onResize(); 
		},300)
		
		setTimeout(function(){
			map._onResize(); 
		},400)
		
		setTimeout(function(){
			map._onResize(); 
		},500)

		setTimeout(function(){
			map._onResize();
            map_click.createCanvas();
		},600)

		if($.globalUser.mentor<13){
			$(".map_smaller, .addBuilding").hide()
		}
		else{
			$(".map_smaller, .addBuilding").show()
		}
	}
	this.makeMapLarger = makeMapLarger;
	
    function mapResize(){
        map._onResize();
    }
    this.mapResize = mapResize;
    
	function makeMapSmaller(){
        $(".runningTimes").removeClass('runningTimes_addClassFromMap');
        
		$(".map_smaller").hide();
		$('.map_searchBox').hide();
		$(".map_larger").show();
		$(".map_goToNotebook").show()
		$(".addBuilding").show()
		
		addBuilding.showPage()
		addBuilding.moveUp()
				
		$(".map").removeClass("mapLarger");
        
		$(".map_note").hide();
		$(".map_note_realEstate").hide();
        $('.map_randomClient').hide();

		setTimeout(function(){
			map._onResize();
		},100)

		setTimeout(function(){
			map._onResize();
		},200)

		setTimeout(function(){
			map._onResize();
		},300)

		setTimeout(function(){
			map._onResize();
		},400)

		setTimeout(function(){
			map._onResize();
		},500)

		setTimeout(function(){
			map._onResize();
            $('.notebookNav').show();        
		},600)
		
	}
	this.makeMapSmaller = makeMapSmaller;
	
	function showNote() {
		addBuilding.hideBuildings()
		$('.map_note').show();
		$('.map_note_cancel').click(closeFlow);
		
		if($.globalUser.mentor<13){
			$(".map_note_cancel").hide()
		}
		else{
			$(".map_note_cancel").show()
		}
	}
	this.showNote = showNote;
	
	function sendToAddCompanyAPI(latlng) {
		
		var companyName = company.getNewCompanyName();

		var data = {
				companyName: companyName,
				lat: latlng[0],
				lng: latlng[1]
			}
		var url = "/api/company/createCompany/"
		
		global.api(url,data,function(data){
			ecoCompanyAPIResult(data);
			
			global.getUser()
		})
	}
	
	function ecoCompanyAPIResult(data) {
		console.log(data)
	}
	
	function deleteCityGeoJson(){
			// console.log(1)
		map.eachLayer(function (layer) { // REMOVE ALL LAYERS WITH MARKERS
			if (layer.feature) {
				// 
					var cityName = layer.feature.name;
					if (typeof cityName != 'undefined') {
						map.removeLayer(layer);
					}
			}	
		});	
	}
	this.deleteCityGeoJson = deleteCityGeoJson;
	
	function zoomToRandomPointInTA() {
		var array = [
			{"x":"32.089588", "y":"34.7774925"}, 
			{"x":"32.0887071", "y":"34.792085"}, 
			{"x":"32.0887071", "y":"34.792085"}, 
			{"x":"32.0958446", "y":"34.7766366"}, 
			{"x":"32.1154574", "y":"34.7966502"}, 
			{"x":"32.0946226", "y":"34.7984124"}, 
			{"x":"32.0599972", "y":"34.7706164"}, 
			{"x":"32.0541617", "y":"34.7688156"}, 
			{"x":"32.0477956", "y":"34.7505092"}
		];
		var random_point = array[Math.floor(Math.random() * array.length)]
		
		zoomToMainBuilding(random_point.x,random_point.y, 15)	

	}
	
	function zoomToRandomPointInJerusalem() {
		var array = [
			
			{"x":"31.7719645", "y":"35.2141375"}, 
			{"x":"31.7850746", "y":"34.792085"}, 
			{"x":"31.7721321", "y":"35.2158639"}, 
			{"x":"31.7731655", "y":"35.2182617"}, 
			{"x":"31.7796353", "y":"35.2242318"}, 
			{"x":"31.7897382", "y":"35.2207928"}, 
			{"x":"31.7570726", "y":"35.1809898"}, 
			{"x":"31.7841211", "y":"35.2142722"}, 
			{"x":"31.7893696", "y":"35.2366359"}
		];
		var random_point = array[Math.floor(Math.random() * array.length)]
		
		zoomToMainBuilding(random_point.x,random_point.y, 15)	

	}
	
	function setMapBounds() {

		// THIS FUNCtiON TAKES ALL THE MARKERS
		// CONVERTS THE MARKERS TO FEATURES
		// Puts them in a GROUP, checks the GROUP bounds
		// FITS THE MAP TO THIS BOUNDS :D 
		

		var userBuildings = $.globalUserBuilding;
		var markersLayer = new L.featureGroup();
		for (var i=0; i<userBuildings.length; i++) {
			var featureLayer = L.mapbox.featureLayer();
			featureLayer.setGeoJSON({
				type: "FeatureCollection",
				features: [{
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [userBuildings[i].lat, userBuildings[i].lng]
					},
					properties: { }
				}]
			});
			markersLayer.addLayer(featureLayer);
			map.fitBounds(markersLayer.getBounds());
		}
	}
    
    function checkIfCanUpgrade(building) {
        // GET NEXT LEVEL JSON
        var nextLevel = buildingsJson.getJson(building.type_id)
        nextLevel = nextLevel.levels[building.level + 1];
        // CHECK IF USER HAVE ENOUGH MONEY
        if ($.globalUser.money < nextLevel.price) {
            return 0;
        }
        // CHECK IF YOU HAVE ENOGUTH ALLREADY BUILDING PROCESS
        else if ($.globalUserOnBuildingProcess.length >= $.globalUser.officeLevel) {
            return 0;
        }
        else return 1;
    }
    
    function validClient(buildingId) {
        // THIS FUNCTION CHECKS IF THIS BULIDING
        // CAN BE CLIENT OR NOT        
        var status = 0;
        switch(buildingId) {
            case 2: // Resturant
            status = 1;
                break;
            case 6: // Cloth store
            status = 1;
        }
        return(status)
        
    }
	function setCircleSize(markerPx) {
            $('.map_userCircle_child').css('width', markerPx)
            $('.map_userCircle_child').css('height', markerPx)
            if (markerPx > 20) {
                if (markerPx == '100') {
                    $('.map_userCircle_child').css('margin-left', '-45px')
                    $('.map_userCircle_child').css('margin-top', '-20px')
                }
                if (markerPx == '50') {
                    $('.map_userCircle_child').css('margin-left', '-18px')
                    $('.map_userCircle_child').css('margin-top', '2px')
                }
                if (markerPx == '33.333333333333336') {
                    $('.map_userCircle_child').css('margin-top', '2px')
                    $('.map_userCircle_child').css('margin-left', '-10px')
                }
                if (markerPx == '25') {
                    $('.map_userCircle_father').hide();
                    $('.map_userCircle_child').hide()
                }
            }
            else {
                $('.map_userCircle_father').hide();
                $('.map_userCircle_child').hide()
                
            }
    }
    
    function setUpgradeSize(markerPx) {
            if (markerPx > 20) {
                if (markerPx == '100') {
                    $('.map_cssupgrade').css('margin-left', '50px')
                }
                if (markerPx == '50') {
                    $('.map_cssupgrade').css('margin-left', '25px')
                }
                if (markerPx == '33.333333333333336') {
                    $('.map_cssupgrade').css('margin-left', '17px')
                    $('.map_cssupgrade').css('margin-top', '-5px')
                }
                if (markerPx == '25') {
                    $('.map_cssupgrade').hide();
                }
            }
            else {
                $('.map_cssupgrade').hide();
                
            }
        
    }
    
    function setCitiesNames(city) {
        if (city == 'telAviv') {
            return 'תל אביב'
        }
        if (city == 'jerusalem') {
            return 'ירושלים'
        }
    }
}
