var runningTimes = new runningTimesJs();
function runningTimesJs(){
	function ctor(){
	}
	this.ctor = ctor;
	
	function showPage(){
	
	}
	this.showPage = showPage;
	
	var numberOfTimes = 0;	
	
	function showBuildingsOnBuildingProocess(json) {
		$('.runningTimes_oneBuilding').hide();
		$(".runningTimes_loop_icon").text("x" + json.length)
		$(".runningTimes_finishWithRep").blur("click")
        $('.bgElements_keyboard').show();
        $('.bgElements_notePad').hide();
    
		if (json.length > 0) {
			
            $('.bgElements_keyboard').hide();
            $('.bgElements_notePad').show();
			var loopLength = json.length;
			numberOfTimes = loopLength;
			
			for (var i=0; i<loopLength; i++ ) {
				
				var oneBuilding = $('.runningTimes_oneBuilding:first').clone();
				
				counterDown(oneBuilding,json[i].dateEnd);
				
				var typeId = json[i].type;
				var buildingName = buildingsJson.getBuildingName(typeId)
				
				oneBuilding.find('.runningTimes_type span').text(buildingName)
				$('.runningTimes_loop').append(oneBuilding);
				
                $('.runningTimes_finishWithRep').find('span').text(choicePopup.getReputation(json[i].dateEnd))
				
                oneBuilding.find(".runningTimes_finishWithRep").click({
					buildingsId:json[i].usersBuildings_id,
					dateEnd:json[i].dateEnd
				},openReputationPopUp);
				
				oneBuilding.show()
			    $(".global_page_runningTimes").show();
			}
		}
		
	}
	this.showBuildingsOnBuildingProocess = showBuildingsOnBuildingProocess;
	
	function counterDown(oneBuilding,dateEnd) {
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
				//write here when building is finis
				numberOfTimes--;
				if(numberOfTimes==0){
					$(".runningTimes_loop_icon").hide();
				}

				clearInterval(thisInterval);
				oneBuilding.remove();
				map_lookAround.removeMarkers();
				map_lookAround.sendCornersToAPI()
				
				updateProfit()
                $('.bgElements_keyboard').show();
                $('.bgElements_notePad').hide();
                $('.runningTimes').hide();
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
}