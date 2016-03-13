var header = new headerJS()
function headerJS (){
	function ctor(){
		$(".header_cont_logout").click(logOut);
		$('.header_cont_homePage, .header_cont_pageName_homePage').click(showHomePage)
		$(".header_menu_li_youtube").click(showYoutube);
		$(".header_menu_li_payment").click(showPayment);
		$('.header_searchCompany_btn').click(searchCompanyinAPI)
		$(".header_cont_pageName_rank").click(showRankPage);
		
		$(".header_company_nameInput").focus(focusInput);
		$(".header_company_nameInput").focusout(focusOutInput);
		$(".header_bottomHeader_money_hover_upgrade").click(goToUpgadeBuilding);
        $(".header_bottomHeader_money").mouseenter(showMentorLevel4_1);
        $(".header_bottomHeader_money").mouseleave(showMentorLevel4_0);
        
        $(".header_bottomHeader_mission4_1_text_submit").click(finisMentor4);
	}
	this.ctor = ctor;
	
	function showRankPage(){
		$(".header_cont_pageName").removeClass("header_cont_pageNameActive")
		$(this).addClass("header_cont_pageNameActive")
		rank.showPage()	
	}
	
    function finisMentor4(){
        $.globalUser.mentor=5;
        clearInterval($.mentor_level4);
        $(".header_bottomHeader_mission4, .header_bottomHeader_mission4_1_text").hide()
        
        mentor.updateMentor();
        mentor.checkMentorLevel();
    } 
    
	function goToUpgadeBuilding(){
		var json = $.globalUserBuilding;

		var loopLength = json.length;

		for(var i=0; i<loopLength ;i++)
		{
			var type_id = json[i].type_id
			if(type_id==5){
				var buildingId = json[i].id;
			}
		}

		upgradeBuilding.showPage(buildingId);
	}
    
    function showMentorLevel4_0(){
        if($.globalUser.mentor==4){
            clearInterval($.mentor_level4);
            $.mentor_level4 = setInterval(function(){
                $(".header_bottomHeader_mission4").fadeToggle(100)
            },500)
        }
    }
    
    function showMentorLevel4_1(){
        clearInterval($.mentor_level4);
        $(".header_bottomHeader_mission4").hide()

        if($.globalUser.mentor==4){
            $(".header_bottomHeader_mission4_1, .header_bottomHeader_mission4_1_text").show()
        }
        else{
            $(".header_bottomHeader_mission4_1, .header_bottomHeader_mission4_1_text").hide()
        }
    }

	function focusInput(){
		$(".header_searchCompany").addClass("header_searchCompanyAddClass");
	}
	function focusOutInput(){
		$(".header_searchCompany").removeClass("header_searchCompanyAddClass");
	}
	
	function setMoney(money,maxMoney) {
		var moneyCheck = parseInt(money); //int of money
		money = Math.floor(money); // string of money
		money = help.addComma(money);

		// make money red if you reach 80% of the money storage
		var maxMoneyMakeRed = maxMoney;

		if(moneyCheck>=maxMoneyMakeRed){
			$(".header_bottomHeader_money_ammount").addClass("header_bottomHeader_money_ammountAddClass");
			$(".header_bottomHeader_money_hover_UpgradeText").show();
		}
		else{
			$(".header_bottomHeader_money_ammount").removeClass("header_bottomHeader_money_ammountAddClass");
			$(".header_bottomHeader_money_hover_UpgradeText").hide()
		}

		$('.header_bottomHeader_money_ammount span').text(money);
	}
	this.setMoney = setMoney;
	
	function setProfit(profit){
		if(profit==null){
			profit = 0;
		}
		
		profit = help.addComma(profit);
		$(".header_bottomHeader_money_hover_money span").text(profit);
	}
	this.setProfit = setProfit;

	function showUpgradOrText(json){
		var loopLength = json.length;

		var buildingId=0;
		for(var i=0; i<loopLength ;i++)
		{
			var type_id = json[i].type_id
			if(type_id==5){
				buildingId = json[i].id;
			}
		}

		if(buildingId==0){
			$(".header_bottomHeader_money_hover_notUpgrade").show();
			$(".header_bottomHeader_money_hover_upgrade").hide();
		}
		else{
			$(".header_bottomHeader_money_hover_notUpgrade").hide();
			$(".header_bottomHeader_money_hover_upgrade").show();
		}
	}
	this.showUpgradOrText = showUpgradOrText;

	function setMaxMoney(maxMoney){
		maxMoney = help.addComma(maxMoney);
		$(".header_bottomHeader_money_hover_maxMoney span").text(maxMoney);
	}
	this.setMaxMoney = setMaxMoney;
	
	function showBottomHeader() {
		$('.header_bottomHeader').show();
	}
	this.showBottomHeader = showBottomHeader;
	function getUserBuildingsSum(userDetails, buildingOnProcess) {
		$('.header_bottomHeader_keys_ammount_sumAv').text(userDetails.officeLevel)
		$('.header_bottomHeader_keys_ammount_sumBuild').text(buildingOnProcess.length)
	}
	this.getUserBuildingsSum = getUserBuildingsSum;
	
	function getUserRep(userDetails) {
		var reputation = help.addComma(userDetails.reputation);
		$('.header_bottomHeader_star_ammount span').text(reputation)
	}
	this.getUserRep = getUserRep;
	
	function showHomePage() {
		$(".header_cont_pageName").removeClass("header_cont_pageNameActive")
		$(".header_cont_pageName_homePage").addClass("header_cont_pageNameActive")
		
		global.showDashboard();
	}
	function showYoutube(){
		youtube.showPage();
	}
	function showPayment(){
		payment.showPage();
	}
	function logOut(){
		global.logOut()
	}
		
	
	function searchCompanyinAPI() {
		$(".header_cont_pageName").removeClass("header_cont_pageNameActive")
		$(this).addClass("header_cont_pageNameActive")
		
		var val = $('#header_searchCompany_input').val();
		var data = {companyName: val}
		var url = "/api/company/search/"
		global.api(url,data,function(data){
			var json = JSON.parse(data);
				company.searchCompany(data);
		})
	}

	
	function getCompanyDetails(userDetails) {
		$('.header_cont_company').unbind('click')
		if (userDetails.companys_name == null) {
			$('.header_cont_company').text('צור תאגיד')
			$('.header_cont_company').click(createCompany)
		}
		
		else {
			$('.header_cont_company').text('תאגיד')
			$('.header_cont_company').click(showCompanyDetails)
			
		}
	}
	this.getCompanyDetails = getCompanyDetails;
	
	function createCompany() {
		company.showPopupPage();
		company.createNewCompany()
	}
	
	function showCompanyDetails() {
		company.showPage($.globalUser.companys_id)
	}
    
    function moveToStar(div,topDiv,loopLength){
        var width = $(div).width();
        var top = topDiv.offset().top;
        var left = topDiv.offset().left;
        
        $(".header_moveToStar").remove();            
                
        for(var i=0; i<loopLength ;i++){
            var transition = (300 + Math.floor(Math.random() * 1000))/1000;

            var css = "width:" + width + "px;" 
                + "top:" + top + "px;"
                + "left:" + left + "px;"
                + "transition:" + transition + "s all;"

            var html = '<div class="header_moveToStar" style=' + css +'>'
                        + '<img src="/www/images/global/star.png">'
                    + '</div>'
            
            $(".header_htmlAnimate").append(html);
        }
        
        setTimeout(function(){
            for(var j=0; j<loopLength ;j++){
                var divAnimate = $(".header_moveToStar:eq(" + j + ")");

                divAnimate.css('top','54px');
                divAnimate.css('left','613px');    
            }
        },10)
        
        setTimeout(function(){
            $(".header_moveToStar").remove()
        },2000)
        
    }
    this.moveToStar = moveToStar;
}
	