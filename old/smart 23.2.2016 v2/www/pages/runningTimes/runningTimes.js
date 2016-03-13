var runningTimes = new runningTimesJs();
function runningTimesJs(){
	function ctor(){
        $(".runningTimes_level11Hez_text_submit").click(mentor.finishLevel11);
        $(".runningTimes_level9_text_submit").click(continueLevel9_1);
        $(".runningTimes_bonusButton").click(addBonus);
	}
	this.ctor = ctor;
	
	function showPage(){
	   $(".global_page_runningTimes").show();
	}
	this.showPage = showPage;
	
	var numberOfTimes = 0;	
	
     function continueLevel9_1(){
        $(".runningTimes_level9Hez, .runningTimes_level9_text").hide()
        
        clearInterval($.mentor_level9_haz);
        $.mentor_level9_haz = setInterval(function(){
            $(".runningTimes_level9_1Hez").fadeToggle(100)    
        },500)
    }
    
	function showBuildingsOnBuildingProocess(jsonBuildings,jsonReq,jsonBonus) {
		$('.runningTimes_oneBuilding').hide();
		$(".runningTimes_loop_icon").text("x" + jsonBuildings.length)
		$(".runningTimes_finishWithRep").blur("click")
        $('.bgElements_keyboard').show();
        $('.bgElements_notePad').hide();
    
        createBonusTime(jsonBonus);
        createBuildingsTime(jsonBuildings);
        createFactoryReqTime(jsonReq);

        if(jsonBonus==undefined && jsonBuildings.length==0 && jsonReq==undefined){
    	   $(".global_page_runningTimes").hide();
        }
	}
	this.showBuildingsOnBuildingProocess = showBuildingsOnBuildingProocess;
    
     function createBuildingsTime(json){
        numberOfTimes = 0;
        if (json!=undefined && json.length > 0) {
            $('.bgElements_keyboard').hide();
            $('.bgElements_notePad').show();
            $('.runningTimes').show();
            
            var loopLength = json.length;
            numberOfTimes = loopLength;
            
            for (var i=0; i<loopLength; i++ ) {
                var oneBuilding = $('.runningTimes_oneBuilding:first').clone();
                counterDown(oneBuilding,json[i].dateEnd,0);
                
                var typeId = json[i].type;
                var buildingName = buildingsJson.getBuildingName(typeId);
                
                oneBuilding.find('.runningTimes_type span').text("לסיום ה" + buildingName);
                $('.runningTimes_loop').append(oneBuilding);
                
                $(oneBuilding).find('.runningTimes_finishWithRep_span').text(choicePopup.getReputation(json[i].dateEnd))
                oneBuilding.find('.runningTimes_oneBuilding_hover').remove()
                oneBuilding.find(".runningTimes_oneBuilding_hoverRep").remove()
                
                oneBuilding.find(".runningTimes_finishWithRep").click({
                    buildingsId:json[i].usersBuildings_id,
                    dateEnd:json[i].dateEnd
                },openReputationPopUp);
                
                oneBuilding.show();
                $(".global_page_runningTimes").show();
            }
        }
    }

    function createFactoryReqTime(json){
        if(json!=undefined && json.length > 0) {
            $('.bgElements_keyboard').hide();
            $('.bgElements_notePad').show();
            $('.runningTimes').show();
            
            var loopLength = json.length;
            numberOfTimes += loopLength;
            
            for(var i=0; i<loopLength; i++ ){
                
                var oneBuilding = $('.runningTimes_oneBuilding:first').clone();
                
                var buildingName = "לאישור הסכם הספקים";
                counterDown(oneBuilding,json[i].endDate,0);
                
                var factoryProfit = help.addComma(json[i].factoryAddProfit)
                oneBuilding.find(".runningTimes_oneBuilding_hover").find('span').text(factoryProfit);
                oneBuilding.find('.runningTimes_type span').text(buildingName);
                oneBuilding.find('.runningTimes_finishWithRep').remove()
                oneBuilding.find(".runningTimes_oneBuilding_hoverRep").remove()
                
                $('.runningTimes_loop').append(oneBuilding);
                
                oneBuilding.show()
                $(".global_page_runningTimes").show();
                
            }
        }
    }
    
    function createBonusTime(json){
        if(json!=undefined && json.length > 0) {
            $('.bgElements_keyboard').hide();
            $('.bgElements_notePad').show();
            $('.runningTimes').show();
            
            var loopLength = json.length;
            numberOfTimes += loopLength;
            
            for(var i=0; i<loopLength; i++ ){
                
                var oneBuilding = $('.runningTimes_oneBuilding:first').clone();
                
                var buildingName = "לקבלת בונוס";
                counterDown(oneBuilding,json[i].dateEnd,json[i].bonus);
                
                // var factoryProfit = help.addComma(json[i].factoryAddProfit)
                oneBuilding.find(".runningTimes_oneBuilding_hover").remove();
                oneBuilding.find('.runningTimes_type span').text(buildingName);
                oneBuilding.find('.runningTimes_finishWithRep').remove();
                
                if(json[i].bonus==1){
                    oneBuilding.find(".runningTimes_oneBuilding_hoverRep").find(".runningTimes_oneBuilding_hover_bonus:first").text('150,000₪ שקל');
                    oneBuilding.find(".runningTimes_oneBuilding_hoverRep").find(".runningTimes_oneBuilding_hover_bonus:last").text('10 מוניטין');
                }
                else if(json[i].bonus==2){
                    oneBuilding.find(".runningTimes_oneBuilding_hoverRep").find(".runningTimes_oneBuilding_hover_bonus:first").text('300,000₪ שקל');
                    oneBuilding.find(".runningTimes_oneBuilding_hoverRep").find(".runningTimes_oneBuilding_hover_bonus:last").text('25 מוניטין');
                }
                else if(json[i].bonus==3){
                    oneBuilding.find(".runningTimes_oneBuilding_hoverRep").find(".runningTimes_oneBuilding_hover_bonus:first").text('400,000₪ שקל');
                    oneBuilding.find(".runningTimes_oneBuilding_hoverRep").find(".runningTimes_oneBuilding_hover_bonus:last").text('25 מוניטין');
                }
                else if(json[i].bonus==4){
                    oneBuilding.find(".runningTimes_oneBuilding_hoverRep").find(".runningTimes_oneBuilding_hover_bonus:first").text('600,000₪ שקל');
                    oneBuilding.find(".runningTimes_oneBuilding_hoverRep").find(".runningTimes_oneBuilding_hover_bonus:last").text('70 מוניטין');
                }
                
                $('.runningTimes_loop').append(oneBuilding);
                
                oneBuilding.show()
                $(".global_page_runningTimes").show();
                
            }
        }
    }
    
	function counterDown(oneBuilding,dateEnd,isBonus) {
		var thisInterval = setInterval(function(){
			var endDate = new Date(dateEnd)
			endDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(),  endDate.getUTCHours(), endDate.getUTCMinutes(), endDate.getUTCSeconds());
			
			var now = new Date();
			var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

			var compateDate = endDate.getTime() - nowUtc.getTime();

			var seconds = Math.floor(compateDate / 1000);
			var minutes = Math.floor(seconds / 60);
			var hours = Math.floor(minutes / 60);
			var days = Math.floor(hours / 24);
			
			hours %= 24;
			minutes %= 60;
			seconds %= 60;
			
			if(hours<10 && hours>0){
				hours = "0" + hours;
			}
			
			if(minutes<10){
				minutes = "0" + minutes;
			}
			
			if(seconds<10){
				seconds = "0" + seconds;
			}

			if(compateDate>0){
				oneBuilding.find('.runningTimes_timer_days').text(days)
				oneBuilding.find('.runningTimes_timer_hours').text(hours)
				oneBuilding.find('.runningTimes_timer_min').text(minutes)
				oneBuilding.find('.runningTimes_timer_sec').text(seconds)
			}
			else{
				//write here when building is finish
				numberOfTimes--;
				if(numberOfTimes==0){
					$(".runningTimes_loop_icon").hide();
				}
                
				clearInterval(thisInterval);
				oneBuilding.remove();
                if(isBonus==0){
                    map_lookAround.removeMarkers();
                    map_lookAround.sendCornersToAPI()
                    
                    updateProfit();
                    if(numberOfTimes==0){
                        $('.bgElements_keyboard').show();
                        $('.bgElements_notePad').hide();
                        $('.runningTimes').hide();
                    }
                }
                else{
                    $(".runningTimes_bonusButton").show()
                }
			}
		},1000)
	}
	
	// update user paramenters after end build a building
	function updateProfit(){
        setTimeout(function(){
            var data = {};
            var url = '/api/users/getUserProfit/';
            global.api(url, data, function(data) {
                var json = JSON.parse(data)
                $.globalUser = json[0][0];
                $.globalUserBuilding = json[1];
                
                header.getUserBuildingsSum($.globalUser, $.globalUserOnBuildingProcess);
                header.getUserRep($.globalUser);
                header.getCompanyDetails($.globalUser);
                header.setProfit($.globalUser.profit);

                map_lookAround.removeMarkers();
                map_lookAround.sendCornersToAPI();
                
                var buildingCount = parseInt($(".header_bottomHeader_keys_ammount_sumBuild").text()) -1;
                $(".header_bottomHeader_keys_ammount_sumBuild").text(buildingCount)			
            });
        },5000)
	}
	
	function openReputationPopUp(e){
		var endTime = e.data.dateEnd;
		var buildingsId = e.data.buildingsId;
		  
		choicePopup.showPageReputation(1,endTime,buildingsId);
	}
    
    function addBonus(){
        var star1 = $(".runningTimes_bonusButton_star1");
        var topDiv = $(".runningTimes_bonusButton_star1").parent()
        header.moveToStar(star1,topDiv,5);
        
        setTimeout(function(){
            $(".runningTimes_bonusButton_star").hide();
            $(".runningTimes_bonusButton").remove()
        },200)
        
        var data = {};
        var url = "/api/runningTime/getBonus/"
        global.api(url, data, function (data) {
            global.getUser();
        })
    }
}