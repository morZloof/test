var buildingsJson = new buildingsJsonJs()
function buildingsJsonJs(){
	
	function getBuildingName(vtype){
		var buildingName = "";
		if (vtype == 0) {
			buildingName = 'משרדי החברה';
		}
		else if (vtype == 1) {
			buildingName = 'בניין מגורים';
		}
		else if (vtype == 2) {
			buildingName = 'מסעדה';
		}
		else if (vtype == 3) {
			buildingName = 'מפעל מזון';
		}
		else if (vtype == 4) {
			buildingName = 'תאגיד';
		}
		else if (vtype == 5) {
			buildingName = 'רואה חשבון';
		}
		else if (vtype == 6) {
			buildingName = 'חנות בגדים';
		}
		else if (vtype == 7) {
			buildingName = 'מפעל בגדים';
		}
		else{
			console.log("error: not find building name file:buildingsJson.js function:getBuildingName");
		}
		
		return buildingName;
	}
	this.getBuildingName = getBuildingName;
	
	function getJson(vtype){
		if(vtype==0){
			return $.building_main;
		}
		else if(vtype==1){
			return $.building_residential;
		}
		else if(vtype==2){
			return $.building_restaurant;
		}
		else if(vtype==3){
			return $.building_foodFactor;
		}
		else if(vtype==4){
			return $.building_corporate;
		}
		else if(vtype==5){
			return $.building_accountant;
		}
		else if(vtype==6){
			return $.building_clothingStore;
		}
		else if(vtype==7){
			return $.building_clothingFactory;
		}
	}
	this.getJson = getJson;
	
	function getImageUrl(vtype,level){
		var json = getJson(vtype);
		var imgUrl = json.levels[level].img

		return imgUrl;
	}
	this.getImageUrl = getImageUrl;
	
	function getTime(vtype,level){
		
		level = level-1;
		var json = getJson(vtype);
		var day = json.levels[level].day;
		var minutes = json.levels[level].minutes;
		var seconds = json.levels[level].seconds;
		var hours = json.levels[level].hours;
		
		var time = "";
		if(day>0){
			time += day + " ימים "
		}
		
		if(hours>0){
			time += hours + " שעות "
		}
		
		if(minutes>0){
			time += minutes + " דקות "
		}
		
		if(seconds>0){
			time += seconds + " שניות "
		}
		
		if(time.length == 0){
			time = "0 שניות"
		}
		return time;
	}
	this.getTime = getTime;
	
	function getMainBuilding() {
		var loopLength = $.globalUserBuilding.length;
		for (var i=0; i< loopLength; i++) {
			if ($.globalUserBuilding[i].type_id == '0') {
				return $.globalUserBuilding[i];
			}			
		}
	}
	this.getMainBuilding = getMainBuilding;
}