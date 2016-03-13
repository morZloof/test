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
	}
	this.ctor = ctor;
	
	function showRankPage(){
		$(".header_cont_pageName").removeClass("header_cont_pageNameActive")
		$(this).addClass("header_cont_pageNameActive")
		rank.showPage()	
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
	function focusInput(){
		$(".header_searchCompany").addClass("header_searchCompanyAddClass");
		//$(".header_searchCompany_btn").addClass("header_searchCompany_btnAddClass");
		//$(".header_company_nameInput").addClass("header_company_nameInputAddClass");
		//$(".header_company_nameInput").attr("placeholder", "חיפוש שחקנים ותאגידים");
	}
	function focusOutInput(){
		$(".header_searchCompany").removeClass("header_searchCompanyAddClass");
		//$(".header_searchCompany_btn").removeClass("header_searchCompany_btnAddClass")
		//$(".header_company_nameInput").removeClass("header_company_nameInputAddClass");
		//$(".header_company_nameInput").attr("placeholder", "חיפוש");
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
}
	