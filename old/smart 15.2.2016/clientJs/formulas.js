/* global */
var formulas = new formulasJs()
function formulasJs(){
	
	function time(seconds){
		
		var time = 1;
		if(seconds<=60 && seconds>0){
			time = 1;
		}
		else if(seconds>60 && seconds<=3600){
			time = 19*(seconds-60)/3540+1;
		}
		else if(seconds>3600 && seconds<=86400){
			time = 240*(seconds-3600)/(82800)+20;
		}
		else if(seconds>86400){
			time = 740*(seconds-86400)/(518400)+260;
		}
		
		return Math.floor(time); 
	}
	this.time = time;
	
	function calculateMoney(now,lastLogin,profit){
		var secondsPast = now - lastLogin;
		var hoursPast = Math.floor(secondsPast/3600);
		
		var secondsLeft = secondsPast - hoursPast * 3600;
		
		var percentSeconds = ((secondsLeft * 100) / 3600) / 100;  
		var addSecondsMoney = percentSeconds * profit;  
		var addHoursMoney = profit * hoursPast;  
		var addMoney = addSecondsMoney + addHoursMoney;

		return addMoney;
	}
	this.calculateMoney = calculateMoney;
	
	//function for clint side
	function residentialVsRestaurantClient(restaurantCount,profit){
		return parseInt(residentialVsRestaurant(restaurantCount,profit)/restaurantCount);
	}
	this.residentialVsRestaurantClient = residentialVsRestaurantClient;

	function restaurantVsResidentialClient(residentialCount,profit){
		return parseInt(restaurantVsResidential(residentialCount,profit)/residentialCount);
	}
	this.restaurantVsResidentialClient = restaurantVsResidentialClient;

	//function for clint side
	function residentialVsResidentialClient(residentialCount,profit){
		return parseInt(residentialVsResidential(residentialCount,profit)/residentialCount);
	}
	this.residentialVsResidentialClient = residentialVsResidentialClient;

	//function for server side
	function restaurantVsResidential(residentialCount,profit){
		
		if(residentialCount>40){
			residentialCount = 40;
		}
		
		var persentResidential = (residentialCount*0.01);
		var addResidential = (profit*persentResidential);

		return parseInt(addResidential);
	}
	this.restaurantVsResidential = restaurantVsResidential;
	//function for server side
	function residentialVsResidential(residentialCount,profit){
		if(residentialCount>40){
			residentialCount = 40;
		}
		
		var persentResidential = (residentialCount*0.01);
		var addResidential = (profit*persentResidential);
		
		return parseInt(addResidential);
	}
	this.residentialVsResidential = residentialVsResidential;
	//function for server side
	function residentialVsRestaurant(restaurantCount,profit){
		
		if(restaurantCount==1){
			var addRestaurant = (profit*0.04)*restaurantCount;
		}
		else if(restaurantCount==2){
			var addRestaurant = (profit*0.03)*restaurantCount;
		}
		else if(restaurantCount==3){
			var addRestaurant = (profit*0.027)*restaurantCount;
		}
		else if(restaurantCount==4){
			var addRestaurant = (profit*0.022)*restaurantCount;
		}
		else{
			restaurantCount=5;
			var addRestaurant = (profit*0.02)*restaurantCount;
		}
		
		return parseInt(addRestaurant);
	}
	this.residentialVsRestaurant = residentialVsRestaurant;
	
	function calculateRestaurant(json,lat,lng,profit){
		var json = restaurantVsRestaurant(json,lat,lng,profit);
		var loopLength = json.length;

		var minus = 0;
		for(var i=0; i<loopLength ;i++){
			minus = minus + parseFloat(json[i].minus);
		}
		
		minus = minus*0.01 // make minus to persent
		
		return minus*profit;
	}
	this.calculateRestaurant = calculateRestaurant;
	
	function restaurantVsRestaurant(json,lat,lng,profit){
		// var closest = 0.016231742057263805;

		var farest = 0.5;
		var loopLength = json.length;
		
		var earthRadius = 6371;
		var influenceArry = [];
		var idArry = [];
		
		for(var i=0; i<loopLength ;i++){
			var building_lat = json[i].lat;
			var building_lng = json[i].lng;
			var buildingId = json[i].id;
			
			var newLat = building_lat-lat; // Difference of latitude
    		var newLng = building_lng-lng; 
	
			var disLat = (newLat*Math.PI*earthRadius)/180; // Vertical distance
			var disLng = (newLng*Math.PI*earthRadius)/180; // Horizontal distance
		
			var distance = Math.pow(disLat, 2) + Math.pow(disLng, 2); 
			distance = Math.sqrt(distance);
			
			if(distance>farest){
				var influence = 0;
			}
			else{
				var influence = 100 - (distance*100/farest);
			}
			influenceArry[i] = influence; 
			idArry[i] = buildingId; 
		}

		var sortArr = influenceArry.sort(function(a,b) { return b - a; }); 
		influenceArry = sortArr;
		
		var result = [];
		if(loopLength>0){//20% 20%
			var present = 20;
			var minus = influenceArry[0]*present/100;

			var row = new Object();
			row.buildingId = idArry[0];
			row.minus = parseInt(minus);
			
			result[0] = row;
		}
		
		if(loopLength>1){//15% 35%
			var present = 15;
			var minus = influenceArry[1]*present/100;
			
			var row = new Object();
			row.buildingId = idArry[1];
			row.minus = parseInt(minus);
			
			result[1] = row;
		}
		
		if(loopLength>2){//15% 50%
			var present = 15;
			var minus = influenceArry[2]*present/100;
			
			var row = new Object();
			row.buildingId = idArry[2];
			row.minus = parseInt(minus);
			
			result[2] = row;
		}
		
		if(loopLength>3){//5% 55%
			var present = 5;
			var minus = influenceArry[3]*present/100;
			
			var row = new Object();
			row.buildingId = idArry[3];
			row.minus = parseInt(minus);
			
			result[3] = row;
		}
		
		if(loopLength>4){//5% 60%
			var present = 5;
			var minus = influenceArry[4]*present/100;
			
			var row = new Object();
			row.buildingId = idArry[4];
			row.minus = parseInt(minus);
			
			result[4] = row;
		}
				 
		return result;
	}
	this.restaurantVsRestaurant = restaurantVsRestaurant;
    
	function factoryVsRestaurant(factoryLevel,restaurantProfit,bid){
		var newProfit = factoryCalculate(factoryLevel,restaurantProfit) - bid

		return newProfit;
	}
	this.factoryVsRestaurant = factoryVsRestaurant;

	function factoryCalculate(factoryLevel,restaurantProfit){
		if(factoryLevel==1){
			var profitPresent = 0.2;
		}
		else if(factoryLevel==2){
			var profitPresent = 0.25;
		}
		else if(factoryLevel==3){
			var profitPresent = 0.3;
		}
		else if(factoryLevel==4){
			var profitPresent = 0.35;
		}
		else if(factoryLevel==5){
			var profitPresent = 0.4;
		}
		else if(factoryLevel==6){
			var profitPresent = 0.45;
		}
		else{
			var profitPresent = 0.5;
		}

		var newProfit = profitPresent*restaurantProfit;
		return newProfit;
	}
	this.factoryCalculate = factoryCalculate;
}