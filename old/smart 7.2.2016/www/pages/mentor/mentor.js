var mentor = new mentorJs()
function mentorJs(){
	ctor()
	function ctor(){
		$(".mentor_box_holder_city").click(markCity);
		
		$(".mentor_box_holder_submit_level_1").click(hidePromo);
		$(".mentor_box_holder_submit_level_1_2").click(finishLevel1);
		$(".mentor_box_holder_submitBonus").click(hideBonus);
		
		$(".mentor_allMission_close").click(hideBigMessions);
		
		$(".mentor_text_mession1").click(showBigMession1);
		$(".mentor_text_mession2").click(showBigMession2);
		$(".mentor_text_mession3").click(showBigMession3);
		
		$(".mentor_level2_submit").click(continueLevel2);
		$(".mentor_level3_submit").click(continueLevel3);
		$(".mentor_level4_submit").click(continueLevel4);
		$(".mentor_level5_submit").click(continueLevel5);
	}
	this.ctor = ctor;
	
	function showPage(){
		$(".global_page_mentor").show()
		checkMentorLevel()
	}
	this.showPage = showPage;
	
	function hideBigMessions(){
		$(".mentor_allMission").hide()
		$(".mentor_allHolder").show()
	}
	
	function showBigMession1(){
		checkComplete(1)
		$(".mentor_allHolder").hide()
		$(".mentor_allMission_mession1").show()
	}
	
	function showBigMession2(){
		checkComplete(2)
		$(".mentor_allHolder").hide()
		$(".mentor_allMission_mession2").show()
	}
	
	function showBigMession3(){
		checkComplete(3)
		$(".mentor_allHolder").hide()
		$(".mentor_allMission_mession3").show()
		
		$(".addBuilding_mentor_poniter")
	}
	
	function continueLevel2(){
		$(".global_page_map").css("-webkit-filter","blur(0px)");
		$(".header").css("-webkit-filter","blur(0px)");
		
		$(".mentor_level2").fadeOut()	
		vmap.deleteCityGeoJson();
	}
	
	function continueLevel3(){
		$(".mentor_level3").css("-webkit-filter","blur(5px)");
		$(".addBuilding").css("-webkit-filter","blur(0px)");
		$(".addBuilding_mentor_level3").show();

		$.addBuilding_mentorLevel3 = setInterval(function(){
			$(".addBuilding_mentor_poniter").fadeToggle(100)
		},500)
			
		$(".mentor_level3_submit").hide()
	}
	
	function continueLevel4(){
		$(".mentor_level4").css("-webkit-filter","blur(5px)");
		$(".addBuilding").css("-webkit-filter","blur(0px)");
		$(".addBuilding_mentor_level3").show();

		$.addBuilding_mentorLevel3 = setInterval(function(){
			$(".addBuilding_mentor_poniter").fadeToggle(100)
		},500)
			
		$(".mentor_level4_submit").hide()
	}
	
	function continueLevel5(){
		$(".mentor_level5").css("-webkit-filter","blur(5px)");
		// $(".addBuilding").css("-webkit-filter","blur(0px)");
		$(".global_page_map").css("-webkit-filter","blur(0px)");
		$(".map_goToNotebook").hide()

		$.addBuilding_mentorLevel5 = setInterval(function(){
			$(".map_mentor_level5").fadeToggle(100)
		},500)

		var mainBuilding = buildingsJson.getMainBuilding();
		vmap.zoomToMainBuilding(mainBuilding.lng,mainBuilding.lat, 18);
		vmap.disableMove();
	}
	
	function checkComplete(mession_id){
		var data = {
			mession_id: mession_id
		};
		
		var url = '/api/mentor/completeMission/';

		global.api(url, data, function(data) {
			if(data == 'pinish' && mession_id==1){
				$(".mentor_text_mession1").hide()
				
				var text = "כל הכבוד! הצלחת לסיים את המשימה.";
				var bonus = 10;
				
				showBonus(text,bonus);
				hideBigMessions()
			}
			else if(data == 'pinish' && mession_id==2){
				$(".mentor_text_mession2").hide()
				
				var text = "כל הכבוד! הצלחת לסיים את המשימה.";
				var bonus = 20;
				
				showBonus(text,bonus);
				hideBigMessions()
			}
			else if(data == 'pinish' && mession_id==3){
				$(".mentor_text_mession3").hide()
				
				var text = "כל הכבוד! הצלחת לסיים את המשימה.";
				var bonus = 15;
				
				showBonus(text,bonus);
				hideBigMessions()
			}
		});
	}
	
	function updateMentor(){
		var data = {
			city_id: city_id
		};
		var url = '/api/mentor/updateMentor/';
		
		global.api(url, data, function(data) {
			var json = JSON.parse(data)
			$.globalUser = json;
			checkMentorLevel()
		});
	}
	this.updateMentor = updateMentor;
	
	function checkMentorLevel(){
		var mentorLevel = $.globalUser.mentor

		if (mentorLevel==1){
			$(".mentor").hide()
			$(".mentor_box, .mentor_box_holder1").show();
		}
		else if (mentorLevel==2){
			$(".mentor").hide();
			$(".mentor_level2").show();
			$(".mentor_box").fadeOut();
			
			$(".mentor_box_holderBonus").hide();
			
			$(".global_page_map").css("-webkit-filter","blur(5px)");
			$(".header").css("-webkit-filter","blur(5px)");
			
			var companyJs = buildingsJson.getJson(0).levels[0];
			
			// setTimeout(function(){
                var icon = buildingsJson.getImageUrl(0,0)
                    map_click.startChecking(icon);
				 vmap.buyHouseAlert(companyJs.img, 0 ,companyJs.price); 
			// }, 5000);
			
		}
		else if (mentorLevel==3){
			$(".mentor").hide();
			$(".mentor_level3").show();
			
			$(".global_page_map").css("-webkit-filter","blur(5px)");
			$(".header").css("-webkit-filter","blur(5px)");
			$(".global_page_bgElements").css("-webkit-filter","blur(5px)");
			$(".addBuilding").css("-webkit-filter","blur(5px)");
		}
		else if (mentorLevel==4){
			$(".mentor").hide();
			$(".mentor_level4").show();
			
			$(".global_page_map").css("-webkit-filter","blur(5px)");
			$(".header").css("-webkit-filter","blur(5px)");
			$(".global_page_bgElements").css("-webkit-filter","blur(5px)");
			$(".addBuilding").css("-webkit-filter","blur(5px)");
		}
		else if (mentorLevel==5){
			$(".mentor").hide();
			$(".mentor_level5").show();

			$(".global_page_map").css("-webkit-filter","blur(5px)");
			$(".header").css("-webkit-filter","blur(5px)");
			$(".global_page_bgElements").css("-webkit-filter","blur(5px)");
			$(".addBuilding").css("-webkit-filter","blur(5px)");
		}
		else if (mentorLevel==6){
			vmap.continueFlow()
			$(".map_note").hide()
				
			$(".global_page_map").css("-webkit-filter","none");
			$(".header").css("-webkit-filter","none");
			$(".global_page_bgElements").css("-webkit-filter","none");
			$(".addBuilding").css("-webkit-filter","none");
			
			$(".mentor").hide();
			$(".mentor_level6").show();
		}
		else{
			$(".map_goToNotebook").show()
			openNormalMentor()
		}
	}
	
	function openNormalMentor(){
		
		$(".mentor_text_mession").hide();
		
		if($.globalUserMentor.mession1 == 0){
			$(".mentor_text_mession1").show()
		}
		
		if($.globalUserMentor.mession2 == 0){
			$(".mentor_text_mession2").show()
		}
		
		if($.globalUserMentor.mession3 == 0){
			$(".mentor_text_mession3").show()
		}
		
		$(".mentor_box").hide();
		$(".mentor").hide();
		$(".mentor_all").show()
	}
	
	function showBox(){
		$(".global_page_mentor").show()
		$(".mentor").hide();
		$(".mentor_box").show();
	}
	
	function hideBonus(){		
		$(".mentor_box, .mentor_box_holderBonus").fadeOut()
	}
	
	function hidePromo(){
		$(".mentor_box_holder").fadeOut()
		$(".mentor_box_holder_leve1").fadeIn()
	}
	
	var city_id;
	function markCity(){
		$(".mentor_box_holder_city").removeClass("mentor_box_holder_cityAddClass");
		$(this).addClass("mentor_box_holder_cityAddClass");
		$(".mentor_box_holder_submit_level_1_2").fadeIn();
		city_id = $(this).find(".mentor_box_holder_city_id").text();
		if(city_id != "telAviv" && city_id != "jerusalem"){
			city_id = "telAviv";
		}
	}
	
	function finishLevel1(){
		// $(".mentor").show();
		$(".mentor_box_holder_submit_level_1, .mentor_box_holderBonus").hide()
		$(".mentor_box_holder_leve1").fadeOut();
		var text = "מעולה! עכשיו נבחר איפה למקם את הביניין הראשי שלך.";
		var bonus = 10;
		
		showBonus(text,bonus);
		
		var data = {
			city_id: city_id
		};
		var url = '/api/mentor/level1/';

		global.api(url, data, function(data) {

			var json = JSON.parse(data)
			$.globalUser = json[3][0];
			$.globalUserCity = json[4];
			checkMentorLevel();
		});
	}
	
	function finishLevel2(){
		var text = "כל הכבוד! ועכשיו נלמד איך לבנות דירות.";
		var bonus = 20;
		
		showBonus(text,bonus);
	}
	this.finishLevel2 = finishLevel2;
	
	function finishLevel3(){
		$(".mentor_box_holder_leve1").fadeOut();
		var text = "מעולה הביניין הזה נותן לך 3,000 שקלים בכל שעה. <br>ככה תוכל להרוויח עוד כסף בשביל לבנות עוד נכסים.";
		var bonus = 15;
		
		showBonus(text,bonus);
	}
	this.finishLevel3 = finishLevel3;

	function finishLevel4(){
		$(".mentor_box_holder_leve1").fadeOut();
		var text = "מעולה! <br> ככל שהמסעדה שלך תהיה באזור עם יותר דירות ככה היא תרוויח יותר כסף.";
		var bonus = 20;
		
		showBonus(text,bonus);
	}
	this.finishLevel4 = finishLevel4;
	
	
	function finishLevel6(){
		$(".mentor_box_holder_leve1").fadeOut();
		var text = "מעולה! <br> עכשיו אני אשאיר אותך עם שלוש משימות שונות<br>כל אחת מהן תיתן לך בונוס שונה.";
		var bonus = 30;
		
		showBonus(text,bonus);
	}
	this.finishLevel6 = finishLevel6;
	
	function showBonus(text,bonus){
		updateMentor()
		$(".mentor_box_holder").show()
		$(".global_page_mentor, .mentor_box_holderBonus").show()
		$(".mentor_box_holderBonus").find(".mentor_box_holder_text").html(text)
		$(".mentor_box_holder_bonus_number").html(bonus)
		$(".mentor_box_holderBonus").fadeIn()	
		// $(".mentor_box_holderBonus").hide()
	}
	this.showBonus = showBonus; 
}