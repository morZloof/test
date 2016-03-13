var notebook = new notebookJs()
function notebookJs(){

	function ctor(){

		// showPage()
	}
	this.ctor = ctor;

	function showPage(){
		$(".global_page_map").hide()
		$(".global_page_notebook").show();
		global.resizePage()
	}
	this.showPage = showPage;



	
	function echoData(json){
		var loopLength = json.length;
		var clone = $(".notebook_rowLoop:first").clone();
		$(".notebook_rowLoop").remove();
		$(".notebook_row_prop").append(clone);
		for(var i=0; i<loopLength ;i++){
			var clone = $(".notebook_rowLoop:first").clone()
			clone.find('.notebook_row_level span').text(json[i].level);
			if (json[i].inBuild) {
				clone.find('.notebook_row_status span').text('בבניה');
			}
			else {
				clone.find('.notebook_row_status span').text('מוכן');
			}
			clone.find('#notebook_row_buildingID').text(json[i].id);
			
			// Type_id: 0 Is Main, 1 Is Residental, 2 is Resturant, 3 is FoodFactory, 4 is Corporation
			var buildingType =  json[i].type_id;
			var buildingLevel = json[i].level;
			var img;
			var street = help.orderStreetName(decodeURIComponent(json[i].street))
			img = buildingsJson.getImageUrl(buildingType,buildingLevel)
			buildingType = buildingsJson.getBuildingName(buildingType);
			
			clone.find('.notebook_row_pic img').attr('src',img);
			clone.find('.notebook_row_name span').text(buildingType);
			clone.find('.notebook_row_street span').text(street);
			clone.find('.notebook_row_upgradeBtn').click({buildingId: json[i].id}, sendToUpgradeBuilding);

			
			$(".notebook_row_prop").append(clone);
			clone.show()
		}
	}
	this.echoData = echoData;	
	
	function sendToUpgradeBuilding(event) {
		var buildingId = event.data.buildingId;
		upgradeBuilding.showPage(buildingId)
	}

	
}
