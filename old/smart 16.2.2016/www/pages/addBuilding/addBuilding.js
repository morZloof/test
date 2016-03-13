var addBuilding = new addBuildingJs()
function addBuildingJs(){

	function ctor(){
		$('.addBuilding_addNewHouse').click(showBuildingsIcons);
		$(document).click(checkIfHide);
	}
	this.ctor = ctor;

	function showPage(){
		$(".global_page_addBuilding").show();
	}
	this.showPage = showPage;
	
	function checkIfHide(e){
		if(typeof e.target.className.split != 'undefined') {
			if(e.target.className.split("_")[0] != "addBuilding"){
				hideBuildings()
			}	
		}
	}
	
	function hidePage(){
		$(".global_page_addBuilding").hide();
	}
	this.hidePage = hidePage;
	
	function moveDown(){
		$(".addBuilding").addClass("addBuildingAddClass")
		// 
	}
	this.moveDown = moveDown;
	
	function moveUp(){
		$(".addBuilding").removeClass("addBuildingAddClass")
	}
	this.moveUp = moveUp;
	
	function getBuildingsData(){
		var data = {}
		var url = "/api/users/getUserBuilding/"
		global.api(url,data,function(data){
			var json = JSON.parse(data);
		})
	}
	
	function echoData(json){
		// TODO:
		// 1. get building pic -- DONE
		// 2. get building name -- DONE
		var loopLength = json.length;
		var clone = $(".addBuilding_rowLoop:first").clone();
		$(".addBuilding_rowLoop").remove();
		$(".addBuilding_row_prop").append(clone);
		for(var i=0; i<loopLength ;i++){
			var clone = $(".addBuilding_rowLoop:first").clone()
			clone.find('.addBuilding_row_level span').text(json[i].level);
			if (json[i].inBuild) {
				clone.find('.addBuilding_row_status span').text('בבניה');
			}
			else {
				clone.find('.addBuilding_row_status span').text('מוכן');
			}
			clone.find('#addBuilding_row_buildingID').text(json[i].id);
			
			// Type_id: 0 Is Main, 1 Is Residental, 2 is Resturant, 3 is FoodFactory, 4 is Corporation
			var buildingType =  json[i].type_id;
			var buildingLevel = json[i].level;
			var img;
			buildingType = buildingsJson.getBuildingName(buildingType);
			
			clone.find('.addBuilding_row_pic img').attr('src',img);
			clone.find('.addBuilding_row_name span').text(buildingType);
			$(".addBuilding_row_prop").append(clone);
			clone.show()
		}
	}
	this.echoData = echoData;

	
	function showBuildingsIcons() {
		
		// TODO: 
		// 1.GET the users building list -- DONE
		// 2. Find the main building Level -- DONE
		// 3. show buildings Icon that relevent to the building level -- DONE
		
		// ID: 0 Means its on constration
		
		if($.globalUser.mentor<13){
			clearInterval($.addBuilding_mentorLevel3);
			$(".addBuilding_mentor_poniter").hide();
			// $(".global_page_map").css("-webkit-filter","blur(0px)");
		}

		if($(".addBuilding_add_iconsList").is(":visible")==false){
			findMainBuildingLevel($.globalUserBuilding)
			$('.addBuilding_addNewHouse_tooltip').show();
            $('.map_larger').hide();
            $('.map_smaller').hide();
		}
		else{
			hideBuildings()
			
		}
	}
	
	function findMainBuildingLevel(usersBuilding) {
		var mainBuildingLevel;
		var loopLength = usersBuilding.length;
		for(var i=0; i<loopLength; i++) {
			if(usersBuilding[i].type_id == 0) { //IT IS MAIN BUILDING
				mainBuildingLevel = usersBuilding[i].level;
			}
		}
		mainBuildingLevel--;
		var globalBuildingsData =  $.building_main.building[mainBuildingLevel--].type
		drawBuildingsIcon(usersBuilding, globalBuildingsData)
	}

	function drawBuildingsIcon(usersBuilding,globalBuildingsData) {
		$('.addBuilding_add_iconsList').show();
		$('.addBuilding_add_iconsList_oneIcon').hide()
		// Type_id: 0 Is Main, 1 Is Residental, 2 is Resturant, 3 is FoodFactory, 4 is Corporation
		var buildingTypeArr =[0,0,0,0,0,0,0,0,0,0]; // THIS IS GOOD FOR 10 BUILDINGS --> if need more, add more 0's

		var loopLength = usersBuilding.length;
		for(var i=0; i<loopLength; i++) {
			if (isNaN(buildingTypeArr[usersBuilding[i].type_id])) {
				buildingTypeArr[usersBuilding[i].type_id] = 0;
			}
			buildingTypeArr[usersBuilding[i].type_id]++ ;
		}
		
		// buildingTypeArr knows how much buildings and which type every users have. 
		// HOW TO KNOW? just go to the building type id position in the array!
		
		
		//REMAMBER TO DEL
		loopLength = globalBuildingsData.length;
		
		for (var i=0; i<loopLength; i++) {
			var oneIcon = $('.addBuilding_add_iconsList_oneIcon:first').clone();
			var buildingID = globalBuildingsData[i].type_id;
			var buildingJson = buildingsJson.getJson(buildingID);
			var thisBuilding = buildingJson.levels[0];
			var amountLeft = globalBuildingsData[i].number - buildingTypeArr[buildingID]  // CHECKING HOW MUCH BULDINGS USER CAN MAKE
			var price = help.addComma(thisBuilding.price);
			var timeString = '';
            var description = getBuildingDescription(buildingID)
             
			if (isNaN(amountLeft)) {
				amountLeft = 0;
			}
			oneIcon.find('.addBuilding_add_iconsList_oneIcon_numLeft_built').text(buildingTypeArr[buildingID])			
			oneIcon.find('.addBuilding_add_iconsList_oneIcon_description').text(description)			

			oneIcon.find('.addBuilding_add_iconsList_oneIcon_numLeft_built').text(buildingTypeArr[buildingID])			
			oneIcon.find('.addBuilding_add_iconsList_oneIcon_numLeft_left').text(globalBuildingsData[i].number)
			oneIcon.find('.addBuilding_add_iconsList_oneIcon_name').text(buildingsJson.getBuildingName(buildingID))
			oneIcon.find('.addBuilding_add_iconsList_oneIcon_price').find('span').text(price)
			
			if (thisBuilding.hours) {
				timeString = thisBuilding.hours + ' שעות ';
			}
			
			if (thisBuilding.minutes) {
				timeString = timeString + thisBuilding.minutes + ' דקות ';
			}
			
			if (thisBuilding.seconds) {
				timeString = timeString + thisBuilding.seconds + ' שניות ';
			}
			
			oneIcon.find('.addBuilding_add_iconsList_oneIcon_time').find('span').text(timeString)
			oneIcon.find('img').attr('src',thisBuilding.img);


			if (amountLeft < 1 || ($.globalUser.mentor==3 && buildingID==2)) { // IF YOU CANT BUY
				oneIcon.addClass('addBuilding_add_iconsList_oneIcon_grayFilter');
				oneIcon.css('cursor','default');
			}
			else {	
				oneIcon.click({buildingType: buildingID, price:thisBuilding.price}, buildBuilding);
			}
			if (buildingID != 4) { // IF ITS corporate, DONT SHOW
				$(".addBuilding_add_iconsList").append(oneIcon);
				oneIcon.show()
			}
		}

		var mentorLevel = $.globalUser.mentor
		if(mentorLevel == 3){
			//$(".addBuilding_add_iconsList_oneIcon").css("opacity","0");
			//$(".addBuilding_add_iconsList_oneIcon:last").css("opacity","1");

			clearInterval($.addBuilding_mentorLevel3_1);
			$.addBuilding_mentorLevel3_1 = setInterval(function(){
				$(".addBuilding_mentor_level3_1").fadeToggle(100)
			},500)
		}
		else if(mentorLevel == 5){
			//$(".addBuilding_add_iconsList_oneIcon").css("opacity","0");
			//$(".addBuilding_add_iconsList_oneIcon:last").css("opacity","1");
			var lastOne = $(".addBuilding_add_iconsList_oneIcon").length - 1;
			
			$(".addBuilding_add_iconsList_oneIcon:eq(" + (lastOne-1) +")").css("opacity","1");

			clearInterval($.addBuilding_mentorLevel4);
			$.addBuilding_mentorLevel4 = setInterval(function(){
				$(".addBuilding_mentor_level4").fadeToggle(100)
			},500)
		}
		else if(mentorLevel == 6){
			//$(".addBuilding_add_iconsList_oneIcon").css("opacity","0");
			//$(".addBuilding_add_iconsList_oneIcon:last").css("opacity","1");
			var lastOne = $(".addBuilding_add_iconsList_oneIcon").length - 1;
			
			$(".addBuilding_add_iconsList_oneIcon:eq(" + (lastOne-1) +")").css("opacity","1");

			clearInterval($.addBuilding_mentorLevel3);
			$.addBuilding_mentorLevel3 = setInterval(function(){
				$(".addBuilding_mentor_level3").fadeToggle(100)
			},500)
		}
        else if(mentorLevel == 8){
            clearInterval($.addBuilding_mentorLevel8);
			$.addBuilding_mentorLevel8 = setInterval(function(){
				$(".addBuilding_mentor_level8").fadeToggle(100)
			},500)
        }
		else{
			$(".addBuilding_add_iconsList_oneIcon").css("opacity","1");
		}
	}
	
	function buildBuilding(e) {
        $(".mentor_block").hide()
		hidePage()
		
		clearInterval($.addBuilding_mentorLevel3);
		clearInterval($.addBuilding_mentorLevel4);
		clearInterval($.addBuilding_mentorLevel3_1);

		$(".addBuilding_mentor_level3").hide();
		$(".addBuilding_mentor_level3_1").hide();
		$(".addBuilding_mentor_level4").hide();
        var clickedIcon = $(this).find('img').attr('src');
		// IF IT IS REAL ESTATE 
        var realEstateID = 15; // CHANGE THE REAL ESTATE ID 
        
        if (e.data.buildingType == realEstateID) {
            map_realEstate.startFlow();
        }
        else {
            map_click.startChecking(clickedIcon);
            vmap.buyHouseAlert(clickedIcon, e.data.buildingType,e.data.price)
        }
	}
	
	function hideBuildings(){
		$('.addBuilding_add_iconsList').hide();
		$('.addBuilding_addNewHouse_tooltip').hide();
        $('.map_larger').show();
		
		var mentorLevel = $.globalUser.mentor
		if(mentorLevel == 2){
			clearInterval($.addBuilding_mentorLevel1)
			$(".addBuilding_mentor_level1").hide()
		}
		
	}
	this.hideBuildings = hideBuildings;
    
    function getBuildingDescription(buildingId) {
        // 7 WORDS !
        var text;
        switch(buildingId) {
            case 1: // Residental
            text = 'מבנה קבע המשמש באופן שגרתי למגורי אדם'
                break;
            case 2: // Resturant
            text = 'בית אוכל, מוסד המוכר מזון ומשקאות '
                break;
            case 3: // Food Factory
            text = 'סדנת ייצור גדולה, שבה מייצרים מזון '
                break;
            case 5: // Accountant
            text = 'ביצוע ביקורת על דוחות כספיים ומתן חוות דעת'
                break;
            case 6: // Cloth store
            text = 'מקום מסחר קמעונאי המאחסן מוצרים הלבשה'
                break;
            case 7:
            text = 'סדנת ייצור גדולה, שבה מייצרים מוצרי הלבשה'
                break;
        }
        return(text)
    }

}
