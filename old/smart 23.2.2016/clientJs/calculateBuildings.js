var calculateBuildings = new calculateBuildingsJs();
function calculateBuildingsJs(){
    //residential
    function residentialVsResidential(residentialCount,profit){
        if(residentialCount>40){
            residentialCount = 40;
        }

        var persentResidential = (residentialCount*0.01);
        var addResidential = (profit*persentResidential);

        addResidential = parseInt(addResidential);

        var addResidential  = parseInt(addResidential/residentialCount);

        return addResidential ;

    }
    this.residentialVsResidential = residentialVsResidential;

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

        addRestaurant = parseInt(addRestaurant);
        addRestaurant = parseInt(addRestaurant/restaurantCount);
        return addRestaurant;
    }
    this.residentialVsRestaurant = residentialVsRestaurant;

    //for restuarnat
    function restaurantVsResidential(residentialCount,profit){
        return residentialVsResidential(residentialCount,profit);
    }
    this.restaurantVsResidential = restaurantVsResidential;

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
            row.minus = (profit*(parseInt(minus)*0.01));

            result[0] = row;
        }

        if(loopLength>1){//15% 35%
            var present = 15;
            var minus = influenceArry[1]*present/100;

            var row = new Object();
            row.buildingId = idArry[1];
            row.minus = (profit*(parseInt(minus)*0.01));

            result[1] = row;
        }

        if(loopLength>2){//15% 50%
            var present = 15;
            var minus = influenceArry[2]*present/100;

            var row = new Object();
            row.buildingId = idArry[2];
            row.minus = (profit*(parseInt(minus)*0.01));

            result[2] = row;
        }

        if(loopLength>3){//5% 55%
            var present = 5;
            var minus = influenceArry[3]*present/100;

            var row = new Object();
            row.buildingId = idArry[3];
            row.minus = (profit*(parseInt(minus)*0.01));

            result[3] = row;
        }

        if(loopLength>4){//5% 60%
            var present = 5;
            var minus = influenceArry[4]*present/100;

            var row = new Object();
            row.buildingId = idArry[4];
            row.minus = (profit*(parseInt(minus)*0.01));

            result[4] = row;
        }

        return result;
    }
    this.restaurantVsRestaurant = restaurantVsRestaurant;
}