var mentor = new mentorJs()
function mentorJs(){
	ctor()
	function ctor(){
		$(".mentor_box_holder_city").click(markCity);
		
		$(".mentor_box_holder_submit_level_1").click(hidePromo);
		$(".mentor_box_holder_submit_level_1_2").click(finishLevel1);
		$(".mentor_box_holder_submitBonus").click(hideBonus);
		$(".mentor_level12_button").click(finishLevel12);
        
		$(".mentor_allMission_close").click(hideBigMessions);
		
		$(".mentor_text_mession1_0").click(showBigMession1_0);
		$(".mentor_text_mession1_1").click(showBigMession1_1);
		$(".mentor_text_mession2_0").click(showBigMession2_0);
		$(".mentor_text_mession2_1").click(showBigMession2_1);
		$(".mentor_text_mession2_2").click(showBigMession2_2);
		$(".mentor_text_mession3_0").click(showBigMession3_0);
		$(".mentor_text_mession3_1").click(showBigMession3_1);
        $(".mentor_text_mession4_0").click(showBigMession4_0);
		// $(".mentor_text_mession").click(showMession);
        
		$(".mentor_level2_submit").click(continueLevel2);
		$(".mentor_level3_submit").click(continueLevel3);
		$(".mentor_level5_submit").click(continueLevel5);
        $(".mentor_level6_submit").click(continueLevel6);
		$(".mentor_level7_submit").click(continueLevel7);
        $(".mentor_level8_submit").click(continueLevel8);
        $(".mentor_level9_submit").click(continueLevel9);
        $(".mentor_level10_submit").click(continueLevel10);
        
        $(document).click(checkIfHide);
        
  //      $(".runningTimes_level9_text_submit").click(continueLevel9_1);
        // $(".mentor_success_button").click(moveStars);
	}
	this.ctor = ctor;
	
	function showPage(){
		$(".global_page_mentor").show();
		checkMentorLevel();
	}
	this.showPage = showPage;
    
    function checkIfHide(e){
        if($.globalUser.mentor>12){
            if(typeof e.target.className.split != 'undefined') {
                if(e.target.className.split("_")[0].indexOf('mentor') < 0){
                    hideBigMessions();
                }	
            }
        }
	}
    
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
        $(".mentor_allMission").find(".mentor_text").html(text);
        $(".mentor_bonus_num").text(bonus);
    }
	
    function showBigMession1_0(){
		var title = $(this).text();        
        var text = 'רכוש שלושה נכסים מסוג בניני מגורים, ומקם אותם על המפה במקום אסטרטגי שיניב לך תשואה גבוהה.';
        var bonus = 10;
        
		checkComplete(1,0,bonus);
        showMession(title,text,bonus);
	}
	
    function showBigMession1_1(){
        var title = $(this).text();        
        var text = 'רכוש חמש נכסים מסוג בניני מגורים, ושתי נכסים מסוג מסעדות. מקם אותם בצורה החכמה ביותר.';
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
		
	}
    
    function showBigMession4_0(){
        var title = $(this).text();        
        var text = 'הוסף את המשחק למועדפים שלך! כך תוכל לזכור לחזור אליו ולסיים את המשימות שלך<br> לחץ על <b>ctrl+D</b> על מנת להוסיף את האתר למועדפים'
        var bonus = 40;
        
		checkComplete(4,0,bonus);
        showMession(title,text,bonus);
    }
	
	function continueLevel2(){
		// $(".global_page_map").css("-webkit-filter","blur(0px)");
		// $(".header").css("-webkit-filter","blur(0px)");
		
		$(".mentor_level2").fadeOut()	
		vmap.deleteCityGeoJson();
	}
	
	function continueLevel3(){
		$(".mentor_level3").removeClass("mentor_notBlock");
		$(".addBuilding").addClass('mentor_notBlock');
		// $(".addBuilding_mentor_level3").show();

		$.addBuilding_mentorLevel3 = setInterval(function(){
			$(".addBuilding_mentor_poniter").fadeToggle(100)
		},500)
			
		$(".mentor_level3_submit").hide()
	}
	
	function continueLevel5(){
        $(".mentor_level5").removeClass('mentor_notBlock');
		$(".addBuilding").addClass('mentor_notBlock');

		$.addBuilding_mentorLevel3 = setInterval(function(){
			$(".addBuilding_mentor_poniter").fadeToggle(100)
		},500)
	}
    
    function continueLevel6(){
        $(".mentor_level6").hide();
        $(".header_cont_pageName_rank").addClass('mentor_notBlock');
        $(".header_bottomHeader_mission6").addClass('mentor_notBlock');
        
        $.mentor_level6 = setInterval(function(){
			$(".header_bottomHeader_mission6").fadeToggle(100)
		},500)
    }
    this.continueLevel6 = continueLevel6;
	
	function continueLevel7(){
        $('.mentor_level7').hide()
        vmap.makeMapLarger();
        $('.mentor_block').hide()
		$(".map_goToNotebook").hide()
        // $(".mapHolder").addClass('mentor_notBlock');

        clearInterval($.addBuilding_mentorLevel5)
		$.addBuilding_mentorLevel5 = setInterval(function(){
			$(".map_mentor_level5").fadeToggle(100)
		},500)

        setTimeout(function(){
            var mainBuilding = buildingsJson.getMainBuilding();
            vmap.zoomToMainBuilding(mainBuilding.lng,mainBuilding.lat, 18);
            vmap.disableMove();
        },500)
        
        setTimeout(function(){
            var mainBuilding = buildingsJson.getMainBuilding();
            vmap.zoomToMainBuilding(mainBuilding.lng,mainBuilding.lat, 18);
            vmap.disableMove();
        },1000)
	}
	
    function continueLevel8(){
        $(".mentor_level8").removeClass('mentor_notBlock');
        
        $(".addBuilding").addClass('mentor_notBlock');
		// $(".addBuilding_mentor_level3").show();

		$.addBuilding_mentorLevel3 = setInterval(function(){
			$(".addBuilding_mentor_poniter").fadeToggle(100)
		},500)
			
		$(".mentor_level3_submit").hide()
    }
    
    function continueLevel10(){
        $(".mentor_level10").hide();
        
        $(".notebookNav_war, .notebookNav").addClass('mentor_notBlock');
        $(".notebookNav_mission10_block").show();
        
        clearInterval($.mentorHaz_level10_0)
        $.mentorHaz_level10_0 = setInterval(function(){
            $(".notebookNav_mission10").fadeToggle(100)    
        },500)
        
    }
    
    function continueLevel9(){
        $(".mentor_level9").hide();
        
        $(".runningTimes_level9Hez, .runningTimes_level9_text").show()
        $('.runningTimes').addClass('mentor_notBlock');
    }
    
    // function continueLevel9_1(){
    //     $(".runningTimes_level9Hez, .runningTimes_level9_text").hide()
        
    //     clearInterval($.mentor_level9_haz);
    //     $.mentor_level9_haz = setInterval(function(){
    //         $(".runningTimes_level9_1Hez").fadeToggle(100)    
    //     },500)
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
                    else if(mession_id==4){
                        $.globalUserMentor.mession4 += 1;
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
	
    var levelFourFirstTime = 0
	function checkMentorLevel(){
        levelFourFirstTime++;
		var mentorLevel = $.globalUser.mentor

		if (mentorLevel==1){
			$(".mentor").hide()
			$(".mentor_box, .mentor_box_holder1").show();
            global.sendMix('mentor level 1');
		}
		else if (mentorLevel==2){
			$(".mentor").hide();
			$(".mentor_level2").show();
			$(".mentor_box").fadeOut();
			
			$(".mentor_box_holderBonus").hide();
			
			var companyJs = buildingsJson.getJson(0).levels[0];
			
            var icon = buildingsJson.getImageUrl(0,0)
            map_click.startChecking(icon);
            vmap.buyHouseAlert(companyJs.img, 0 ,companyJs.price);
            
            global.sendMix('mentor level 2');
		}
		else if (mentorLevel==3){
			$(".mentor").hide();
            $(".mentor_block").show()
			$(".mentor_level3").show();
			
            $(".mentor_level3").addClass("mentor_notBlock");
            
            global.sendMix('mentor level 3');
		}
        else if(mentorLevel==4){
            if(levelFourFirstTime==1){
                makeLevel4()
            }
            
            global.sendMix('mentor level 4');
        }
		else if (mentorLevel==5){
            $(".mentor_block").show();
            $(".header_bottomHeader_money").removeClass("mentor_notBlock");
			$(".mentor").hide();
			$(".mentor_level5").show();
			
			global.sendMix('mentor level 5');
		}
        else if (mentorLevel==6){
			$(".mentor").hide();
			$(".mentor_level6").show();
			$(".addBuilding").removeClass("mentor_notBlock");
            $(".mentor_level6").addClass('mentor_notBlock');
            $(".mentor_block").show();

	        global.sendMix('mentor level 6');
		}
		else if (mentorLevel==7){
			$(".mentor").hide();
            $(".mentor_block").show();
			$(".mentor_level7").show();
            
            $('.header_cont_pageName_rank').removeClass('mentor_notBlock'); 
            $(".mentor_level7").addClass('mentor_notBlock');
            
            clearInterval($.mentor_level6);
            $(".header_bottomHeader_mission6").hide();
            
            global.sendMix('mentor level 7');
		}
		else if (mentorLevel==8){
            vmap.closeFlow();
            $(".mentor_block").show();
			$(".mentor_level7").hide();
				
            $(".mentor_level8").addClass("mentor_notBlock");
			$(".mentor").hide();
			$(".mentor_level8").show();
            
            global.sendMix('mentor level 8');
		}
        else if(mentorLevel==9){
            $(".mentor_block").show();
            $(".mentor_level8").hide();
				
            $(".mentor_level9").addClass("mentor_notBlock");
			$(".mentor").hide();
			$(".mentor_level9").show();
            
            global.sendMix('mentor level 9');
        }
        else if(mentorLevel==10){
            $(".mentor_block").show();
            $(".mentor_level9").hide();
            $(".addBuilding").removeClass("mentor_notBlock");
            
            $(".mentor_level10").addClass("mentor_notBlock");
			$(".mentor").hide();
			$(".mentor_level10").show();
            
            global.sendMix('mentor level 10');
        }
        else if(mentorLevel==11){
            $(".mentor_block").show();
            $(".mentor_level10").hide();
            
            setTimeout(function(){
                $(".mentor_level10").hide();
            },1000)
			
            $(".runningTimes, .runningTimes_level11Hez, .runningTimes_level11Hez_text").addClass('mentor_notBlock');
            $(".runningTimes_level11Hez, .runningTimes_level11Hez_text").show()
            
            global.sendMix('mentor level 11');
        }
        else if(mentorLevel==12){;
            vmap.closeFlow();
            $(".notebookNav_mission10_block").hide(); //its very important: remove the notebook block from mentor level 10
            $(".mentor_level12, .mentor_all").show();
            $(".mentor_block").show();
            
            $(".runningTimes_level11Hez, .runningTimes_level11Hez_text").hide()
            $(".mentor_level12").addClass('mentor_notBlock');
            $(".mentor_all").addClass('mentor_notBlock');
            
            global.sendMix('mentor level 12');
        }
		else{
            $(".notebookNav_mission10_block").hide(); //its very important: remove the notebook block from mentor level 10
            $(".mentor_all").removeClass('mentor_notBlock');
			$(".map_goToNotebook").show()
			openNormalMentor()
		}
	}
    	
    function makeLevel4(){
        $(".mentor_level3").hide();
        $(".addBuilding").removeClass('mentor_notBlock')
        $(".mentor_block").show();
        $(".header_bottomHeader_money").addClass('mentor_notBlock');
        
        $(".header_bottomHeader_mission4").show()
        
        clearInterval($.mentor_level4);
        $.mentor_level4 = setInterval(function(){
            $(".header_bottomHeader_mission4").fadeToggle(100)
        },500)
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
        
        if($.globalUserMentor.mession4==0){
            $(".mentor_text_mession4_0").show();
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
        
        if($.globalUser.mentor==4){
            makeLevel4()
        }
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
		var text ='נכס מסוג בניין מגורים, מניב 3,000 ש"ח כל שעה עגולה. <br> בשביל להמשיך להרוויח כסף, תצטרך לרכוש עוד נכסים.';
		var bonus = 15;
		
		showBonus(text,bonus);
	}
	this.finishLevel3 = finishLevel3;

	function finishLevel5(){
		$(".mentor_box_holder_leve1").fadeOut();
		var text = "מעולה! <br> ככל שהמסעדה שלך תהיה באזור עם יותר דירות ככה היא תרוויח יותר כסף.";
		var bonus = 20;
		
        $.globalUser.mentor=6;
		showBonus(text,bonus);
	}
	this.finishLevel5 = finishLevel5;
	
    function finishLevel9(){
		$(".mentor_box_holder_leve1").fadeOut();
		var text = "נקודות מוניטין זה נכס בלתי מוחשי, החשוב ביותר לכל איש עסקים. תוכל לרכוש מוניטין על ידי ביצוע משימות.";
		var bonus = 10;
		
		showBonus(text,bonus);
	}
	this.finishLevel9 = finishLevel9;
    
    function finishLevel10(){
        $(".mentor_level10").hide();
        $(".notebookNav").show();
		$(".mentor_box_holder_leve1").fadeOut();
		var text = "מעולה! הצעת המחיר נשלחה ללקוח.";
		var bonus = 50;
		
		showBonus(text,bonus);
        
        $(".global_page_war").hide()		
        vmap.closeFlow();
		vmap.showPage();
        
        $.globalUser.mentor=11;
	}
	this.finishLevel10 = finishLevel10;
    
	function finishLevel8(){
		$(".mentor_box_holder_leve1").fadeOut();
		var text = "כללי המשחק הם ברורים: ללא לקוחות, המפעל לא ירוויח כסף כמו כן, הלקוחות ירצו שהמפעלים הטובים ביותר יתנו להם שירות.<br>";
		var bonus = 30;
		
		showBonus(text,bonus);
	}
	this.finishLevel8 = finishLevel8;
    
    function finishLevel11(){
		$(".runningTimes").removeClass("mentor_notBlock");
		
        $(".runningTimes_level11Hez, .runningTimes_level11Hez_text").hide();
        updateMentor()
	}
	this.finishLevel11 = finishLevel11;
    
	function finishLevel12(){
        global.sendMix('mentor finish');
        global.getUser();
        
        $(".mentor_level12, .mentor_block").hide();
        updateMentor()
	}
	this.finishLevel12 = finishLevel12;
	
	function showBonus(text,bonus){
		updateMentor()
		$(".mentor_box_holder").show()
		$(".global_page_mentor, .mentor_box_holderBonus").show()
		$(".mentor_box_holderBonus").find(".mentor_box_holder_text").html(text)
		$(".mentor_box_holder_bonus_number").html(bonus)
		$(".mentor_box_holderBonus").fadeIn()	
	}
	this.showBonus = showBonus; 
}