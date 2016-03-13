var mentor = new mentorJs()
function mentorJs(){
	ctor()
	function ctor(){
		$(".mentor_box_holder_city").click(markCity);
		
		$(".mentor_box_holder_submit_level_1").click(hidePromo);
		$(".mentor_box_holder_submit_level_1_2").click(finishLevel1);
		$(".mentor_box_holder_submitBonus").click(hideBonus);
		
		$(".mentor_allMission_close").click(hideBigMessions);
		
		$(".mentor_text_mession1_0").click(showBigMession1_0);
		$(".mentor_text_mession1_1").click(showBigMession1_1);
		$(".mentor_text_mession2_0").click(showBigMession2_0);
		$(".mentor_text_mession2_1").click(showBigMession2_1);
		$(".mentor_text_mession2_2").click(showBigMession2_2);
		$(".mentor_text_mession3_0").click(showBigMession3_0);
		$(".mentor_text_mession3_1").click(showBigMession3_1);
        
		// $(".mentor_text_mession").click(showMession);
        
		$(".mentor_level2_submit").click(continueLevel2);
		$(".mentor_level3_submit").click(continueLevel3);
		$(".mentor_level4_submit").click(continueLevel4);
		$(".mentor_level5_submit").click(continueLevel5);
        
        // $(".mentor_success_button").click(moveStars);
	}
	this.ctor = ctor;
	
	function showPage(){
		$(".global_page_mentor").show()
		checkMentorLevel()
	}
	this.showPage = showPage;
	
    function moveStars(bonus){
        var left = $('.header_bottomHeader_star img').offset().left - 40;

        var img1_left= $(".mentor_success_button_img1").css('left');
        $(".mentor_success_button_img1").addClass("mentor_success_button_img1_addClass");
        $(".mentor_success_button_img1").css("left",left + 'px');
        
        var img2_left= $(".mentor_success_button_img2").css('left');
        $(".mentor_success_button_img2").addClass("mentor_success_button_img2_addClass");
        $(".mentor_success_button_img2").css("left",left + 'px');
        
        var img3_left= $(".mentor_success_button_img3").css('left');
        $(".mentor_success_button_img3").addClass("mentor_success_button_img3_addClass");
        $(".mentor_success_button_img3").css("left",left + 'px');
        
        $(".mentor_success_button_beforeSuccess").hide();
        $(".mentor_success_button_afterSuccess").show();
        
        setTimeout(function(){
            $(".mentor_success_button_img1").hide()
            $(".mentor_success_button_img1").css("left",img1_left);
            $(".mentor_success_button_img1").removeClass("mentor_success_button_img1_addClass");
        },500)
        
        setTimeout(function(){
            $(".mentor_success_button_img2").hide()
            $(".mentor_success_button_img2").css("left",img2_left);
            $(".mentor_success_button_img2").removeClass("mentor_success_button_img2_addClass");
            
            $.globalUser.reputation += bonus;
            header.getUserRep($.globalUser)
        },1000)
        
        setTimeout(function(){
            $(".mentor_success_button_img3").hide()
            $(".mentor_success_button_img3").css("left",img3_left);
            $(".mentor_success_button_img3").removeClass("mentor_success_button_img3_addClass");
        },1500)
        
        setTimeout(function(){
            $(".mentor_allMission").find('.mentor_text').show();
            $(".mentor_allMission").find('.mentor_success').hide()
            $(".mentor_success_button_beforeSuccess").show();
            $(".mentor_success_button_afterSuccess").hide();
            hideBigMessions()
        },1500)
    }
    
	function hideBigMessions(){
		$(".mentor_allMission").hide()
		$(".mentor_allHolder").show()
	}
	
    function showMession(title,text,bonus){
        $(".mentor_allHolder").hide();
		$(".mentor_allMission").show();
        
        $(".mentor_allMission").find(".mentor_title").text(title);
        $(".mentor_allMission").find(".mentor_text").text(text);
        $(".mentor_bonus_num").text(bonus);
    }
	
    function showBigMession1_0(){
		var title = $(this).text();        
        var text = 'בנה 3 דירות על המפה.';
        var bonus = 10;
        
		checkComplete(1,0,bonus);
        showMession(title,text,bonus);
	}
	
    function showBigMession1_1(){
        var title = $(this).text();        
        var text = 'בנה 5 דירות ו2 מסעדות על המפה';
        var bonus = 40;
        
		checkComplete(1,0,bonus);
        showMession(title,text,bonus);   
    }
    
	function showBigMession2_0(){
        var title = $(this).text();        
        var text = 'שדרג את המשרד הראשי שלך לרמה 3.';
        var bonus = 20;
        
		checkComplete(2,0,bonus);
        showMession(title,text,bonus);
	}
	
    function showBigMession2_1(){
        var title = $(this).text();        
        var text = 'שדרג את המשרד הראשי שלך לרמה 4.'
        var bonus = 30;
        
		checkComplete(2,0,bonus);
        showMession(title,text,bonus);
    }
	
    function showBigMession2_2(){
        var title = $(this).text();        
        var text = 'שדרג את המשרד הראשי שלך לרמה 5.';
        var bonus = 30;
        
		checkComplete(2,0,bonus);
        showMession(title,text,bonus);
    }
    
    function showBigMession3_0(){
        var title = $(this).text();        
        var text = 'שדרג דירה אחת לרמה 2.';
        var bonus = 15;
        
		checkComplete(3,0,bonus);
        showMession(title,text,bonus);
    }
    
    function showBigMession3_1(){
        var title = $(this).text();        
        var text = 'שפר מסעדה אחת לרמה 2 ודירה אחת לרמה 3.';
        var bonus = 30;
        
		checkComplete(3,0,bonus);
        showMession(title,text,bonus);
    }
    
    function showBigMession3(){
		checkComplete(3,0)
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
	
    // function takeBonus(){
        
    // }
    
	function checkComplete(mession_id,toComplete,bonus){
		var data = {
			mession_id: mession_id,
            toComplete: toComplete
		};
		
		var url = '/api/mentor/completeMission/';

        if(toComplete==1){
            moveStars(bonus);    
        }
        
		global.api(url, data, function(data) {
            if(data=='pinish' && toComplete==0){
                $(".mentor_success_button_img1").show();;
                $(".mentor_success_button_img2").show();;
                $(".mentor_success_button_img3").show();;
                
                $(".mentor_allMission").find(".mentor_text").hide();
                $(".mentor_allMission").find(".mentor_success").show();
                $(".mentor_allMission").find(".mentor_success_button span").text(bonus);
                
                $(".mentor_success_button_beforeSuccess").off()
                $(".mentor_success_button_beforeSuccess").click(function(){
                    checkComplete(mession_id,1,bonus)
                    
                    //update mentor list
                    if(mession_id==1){
                        $.globalUserMentor.mession1 += 1;
                    }
                    else if(mession_id==2){
                        $.globalUserMentor.mession2 += 1;
                    }
                    else if(mession_id==3){
                        $.globalUserMentor.mession3 += 1;
                    }
                    openNormalMentor()
                })
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
			$(".mentor_text_mession1_0").show()
		}
		else if($.globalUserMentor.mession1 == 1){
			$(".mentor_text_mession1_1").show()
		}
        else if($.globalUserMentor.mession1 == 2){
			$(".mentor_text_mession1_2").show()
		}
        
		if($.globalUserMentor.mession2 == 0){
			$(".mentor_text_mession2_0").show()
		}
        else if($.globalUserMentor.mession2 == 1){
            $(".mentor_text_mession2_1").show()
		}
		else if($.globalUserMentor.mession2 == 2){
            $(".mentor_text_mession2_2").show()
		}
        
		if($.globalUserMentor.mession3 == 0){
			$(".mentor_text_mession3_0").show()
		}
		else if($.globalUserMentor.mession3 == 1){
			$(".mentor_text_mession3_1").show()
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