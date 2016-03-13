var upgradeBuilding = new upgradeBuildingJs()
function upgradeBuildingJs(){
	function ctor(){
		$('.upgradeBuilding_bg').click(hidePage);
		$('.upgradeBuilding_holder_close').click(hidePage);
		$('.upgradeBuilding_holder_accept').click(sendToApi)
		
		// setTimeout(function(){
		// 	showPage(851)
		// },1000)
	}
	this.ctor = ctor;
	
	function showPage(buildingId) {
		$(".upgradeBuilding_holder_id").text(buildingId);
		$('.global_page_upgradeBuilding').fadeIn();
		
		$(".global_pagesFixed").css("-webkit-filter", "blur(5px)")
		showData(buildingId,$.globalUserBuilding);
	}
	this.showPage = showPage;

	function hidePage() {
		$(".global_pagesFixed").css("-webkit-filter", "blur(0px)")
		$('.global_page_upgradeBuilding').fadeOut();
	}
	function showData(buildingId,json){
		var loopLength = json.length;

		for(var i=0; i<loopLength ;i++){
			if(json[i].id == buildingId){
				var jsonNum = i;
			}	
		}
		
		var vtype = json[jsonNum].type_id;
		
		var name = buildingsJson.getBuildingName(vtype);
		var level = json[jsonNum].level;
		var imgUrl = buildingsJson.getImageUrl(vtype,(level+1));
		var title = " שיפור לרמה " + (level+1);
		var time = buildingsJson.getTime(vtype,(level+1)) 
		var streetName =  decodeURIComponent(json[jsonNum].street)
		var building = buildingsJson.getJson(vtype)
		var bid = json[jsonNum].jsonProfit;
        
		var profit = building.levels[level-1].profit
		var nextProfit = building.levels[level].profit;
		var spaceProft = nextProfit - profit;
		var price = '₪' + building.levels[level].price;
		
		var mainBuildingRequiremnt = building.levels[level].mainBuilding;
		var mainBuildingLevel = buildingsJson.getMainBuilding();
		
		if (vtype == 0) {
			$('.upgradeBuilding_holder_nextBuildings').show();			
			$('.upgradeBuilding_holder_sacle').hide();
			$('.upgradeBuilding_holder_textProfit').hide();
			$('.upgradeBuilding_holder_sum').hide();
			$('.upgradeBuilding_holder_nextBuildings_one').hide()
			
			var currentBuildingsJson = $.building_main.building[level-1].type;
			var nextLevelBuildingJson = $.building_main.building[level].type;

			for (var i=0; i<nextLevelBuildingJson.length; i++) {
				var oneBuilding = $('.upgradeBuilding_holder_nextBuildings_one:first').clone();
				var id = nextLevelBuildingJson[i].type_id;
				var number = nextLevelBuildingJson[i].number;
				var img = buildingsJson.getImageUrl(id,0);
				
				for (var j=0; j<currentBuildingsJson.length; j++) {
					if (currentBuildingsJson[j].type_id == id) {
						number = number - currentBuildingsJson[j].number;
					}
				}
				if (number > 0) {
					oneBuilding.find('img').attr('src',img);
					oneBuilding.find('.upgradeBuilding_holder_nextBuildings_number').text(number);
					oneBuilding.show();
					$('.upgradeBuilding_holder_nextBuildings').append(oneBuilding);
				}
				howManyNewBuildingsInaRow()
			}
			
		}
		else if(vtype == 5) {	// Accountent
			// CONCULATE PRESENTAGE
			$('.upgradeBuilding_holder_nextBuildings').hide();		
			$('.upgradeBuilding_holder_sacle').show();
			$('.upgradeBuilding_holder_textProfit').show();
			$('.upgradeBuilding_holder_sum').show();
			
             profit = building.levels[level-1].maxMoney
             nextProfit = building.levels[level].maxMoney;
             spaceProft = nextProfit - profit;
            
			var lastLevelProfit = building.levels[building.levels.length-1].maxMoney;
			var currentPrecetange = profit * 100 / lastLevelProfit;
			var spacePrecetange = spaceProft * 100 / lastLevelProfit;
			
			$('.upgradeBuilding_holder_sacle_current').css('width', currentPrecetange +'%');
			$('.upgradeBuilding_holder_sacle_pot').css('width', spacePrecetange +'%');
	
			profit = help.addComma(profit);
			nextProfit = help.addComma(nextProfit);
			spaceProft = help.addComma(spaceProft);
			
			$(".upgradeBuilding_holder_textProfit_current .upgradeBuilding_holder_textProfit_text").text('יכולת נוכחית');
			$(".upgradeBuilding_holder_textProfit_current .upgradeBuilding_holder_textProfit_sum").text(profit);
			$(".upgradeBuilding_holder_textProfit_pot .upgradeBuilding_holder_textProfit_text").text('יכולת פוטנציאלית');
			$(".upgradeBuilding_holder_textProfit_pot .upgradeBuilding_holder_textProfit_sum").text(spaceProft);
			$(".upgradeBuilding_holder_sum").text('סה"כ יכולת ');
			$(".upgradeBuilding_holder_sum").append('<span></span>');
			$(".upgradeBuilding_holder_sum span").text(nextProfit);

			if (mainBuildingRequiremnt > mainBuildingLevel.level ) {
				$('.upgradeBuilding_holder_notMinimum').show();
				$('.upgradeBuilding_holder_button').hide()
				$('.upgradeBuilding_holder_notMinimum_text span').text(mainBuildingRequiremnt)
			}
		}
		else {	
			// CONCULATE PRESENTAGE
			$('.upgradeBuilding_holder_nextBuildings').hide();		
			$('.upgradeBuilding_holder_sacle').show();
			$('.upgradeBuilding_holder_textProfit').show();
			$('.upgradeBuilding_holder_sum').show();
			
			var lastLevelProfit = building.levels[building.levels.length-1].profit;
			var currentPrecetange = profit * 100 / lastLevelProfit;
			var spacePrecetange = spaceProft * 100 / lastLevelProfit;
			
			$('.upgradeBuilding_holder_sacle_current').css('width', currentPrecetange +'%');
			$('.upgradeBuilding_holder_sacle_pot').css('width', spacePrecetange +'%');
	
			profit = help.addComma(profit);
			nextProfit = help.addComma(nextProfit);
			spaceProft = help.addComma(spaceProft);
			
                
            $(".upgradeBuilding_holder_textProfit_current .upgradeBuilding_holder_textProfit_sum").text(profit);
			$(".upgradeBuilding_holder_textProfit_pot .upgradeBuilding_holder_textProfit_sum").text(spaceProft);
            if(vtype==3 || vtype==7){
                getFactoryProfit(level+1,buildingId,bid);
                $(".upgradeBuilding_holder_sum span").text("");
            }
            else{
                $(".upgradeBuilding_holder_sum span").text(nextProfit);
            }

			if (mainBuildingRequiremnt > mainBuildingLevel.level ) {
				$('.upgradeBuilding_holder_notMinimum').show();
				$('.upgradeBuilding_holder_button').hide()
				$('.upgradeBuilding_holder_notMinimum_text span').text(mainBuildingRequiremnt)
			}
		}
        price = help.addComma(price)
        $(".upgradeBuilding_holder_street span").text(streetName);
        $(".upgradeBuilding_holder_time span").html(time);
        $(".upgradeBuilding_holder_image").attr("src",imgUrl);
        $(".upgradeBuilding_holder_title").text(title);
        $(".upgradeBuilding_holder_buildingName").text(name);
        $('.upgradeBuilding_holder_accept').text(price);
        centerBtn();
        ballonSize();
			
	}
	this.showData = showData;
	
    function getFactoryProfit(level,buildingId,bid){
        
		var url = "/api/war/getStoreProfit/"
		var data = {
			factoryId: buildingId
		}
		
		global.api(url,data,function(data){
			var json = JSON.parse(data);
            var storeProfit = json[0].profit - bid;
            
            var nextProfit = formulas.factoryCalculate(level,storeProfit);
            $(".upgradeBuilding_holder_sum span").text(nextProfit);
		})
    }
	function sendToApi(e) {
		var id = $(".upgradeBuilding_holder_id").text()
		var url = "/api/buy/updateBuilding/"
		var data = {
			buildingId: id
		}
		
		global.api(url,data,function(data){
			echoApi(data);
			
			if($.globalUser.mentor==5){
				clearInterval($.addBuilding_mentorLevel5_2);
				$(".upgradeBuilding_holder_level5_3").hide();
				mentor.updateMentor()
			}
			
			hidePage()
		})
	}
	
	function echoApi(data) {
		if (data == 'error: you dont have enough office level') {
			valert.showPage('הרמה של המשרד לא מספיק גבוהה')
		}
		else if (data == 'error: you dont have money') {
			valert.showPage('אין לך מספיק כסף')
		}
		else if (data == 'error: you dont have enough main building level') {
			valert.showPage('הרמה של הבניין הראשי לא מספיק גבוהה')
		}
		else if (data == 'error: the building is in build') {
			valert.showPage('הבניין כבר בבנייה')
		}
		else {
			// STARTED UPGRADEING
			vmap.map.closePopup();
            map_lookAround.removeMarkers();
            map_lookAround.sendCornersToAPI();		
		}
		vmap.map.closePopup();
		global.getUser();
	}
	
	function centerBtn() {
		var btnWith = $('.upgradeBuilding_holder_accept').width() + 30;
		btnWith = btnWith / 2;

		 $('.upgradeBuilding_holder_accept').css('margin-left','-'+ btnWith +'px')
	}
	
	function ballonSize(){
		var textWith = $('.upgradeBuilding_holder_time span').text().length * 8;
		 $('.upgradeBuilding_holder_time').css('width',textWith +'px')
		
	}
	
	function howManyNewBuildingsInaRow(){
		var buildingCounter = 100 - $('.upgradeBuilding_holder_nextBuildings_one').length * 10;
		 $('.upgradeBuilding_holder_nextBuildings_one').css('width',buildingCounter +'px')
	}

}

