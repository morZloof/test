 //$.rootUrl =  "http://212.199.178.35"
//$.rootUrl =  "http://localhost:3000"
// $.rootUrl =  "http://default-environment-etpcza6ksh.elasticbeanstalk.com"
$.rootUrl =  ""

var global = new globalJs()
function globalJs(){

	function main(){
		getUser();
		showDashboard();
		//resizePage();
		
		$(window).resize(resizePage);
		$(".global_pagesFixed").click(scrollToTop);
		loadJson()
	}
	this.main = main;

	function loadJson(){
		$.building_main = json_mainBuilding;
		$.building_residential = json_residential;
		$.building_corporate = json_corporate;
		$.building_restaurant = json_restaurant;
		$.building_foodFactor = json_foodFactory;
		$.building_accountant = json_accountant;
		$.building_clothingStore = json_clothingStore;
		$.building_clothingFactory = json_clothingFactory;
	}

	function globalHide(){
		$(".global_hide").hide();
	}
	this.globalHide = globalHide;

	function scrollToTop(){
		$("body,html").animate({ scrollTop: 0 }, 500);
	}
	function resizePage(){
		
		//page height
		var windowHeight = $(window).height()
		var headerHeight = $(".header").height()
		var pagesHeight = windowHeight - headerHeight - 20;
	
		if ($('.map').is(":hidden")==true && $('.notebook').is(":hidden")==true){
			var mapFromTop = $('.war').offset().top
			var mapPadding = 20;
		}
		else if ($('.map').is(":hidden")==true){
			var mapFromTop = $('.notebook').offset().top
			var mapPadding = 20;
		}
		else{
			var mapFromTop = $('.map').offset().top
			var mapPadding = 20;
		}

		var mapHieght = windowHeight - mapFromTop - mapPadding - 70;
		
		var headerHeight = $(".header").height();
		var feedHeight = windowHeight - headerHeight - 5;
		
		$(".global_pagesHolder, .global_pagesFixed").css("height",pagesHeight + "px");
		$(".map, .notebook, .war").css("height",mapHieght + "px");
	
		// $(".notebook").css("height","100px")
				
		$(".global_page_feed").css("height",feedHeight + "px");
		$(".feed_cont").css("height",(feedHeight-20) + "px");

		//page width
		var windowWidth = $(window).width()


		var mentorWidth = 306;
		var mapMarginRight = 115;

		if($.globalUser.mentor<8){
			var mentorWidth = 380;
		}

		var mapWidth = windowWidth - mentorWidth - mapMarginRight - 45;
		var feedWidth = windowWidth - mentorWidth - mapMarginRight - 27;

		$(".addBuilding").css('left',(mentorWidth+60) + 'px')
		$(".map, .notebook, .war").css("width",mapWidth + "px");
		$(".feed").css("width",feedWidth + "px");

	}
	this.resizePage = resizePage;
	
	function getUser(){
		var data = {};
		var url = '/api/users/getUser/';

		global.api(url, data, function(data) {

			data = JSON.parse(data);
			$.globalUser = data[0][0]; 
			$.globalUserBuilding = data[1]; 
			$.globalUserOnBuildingProcess = data[2];
			$.globalUserMentor = data[3][0]; 
			$.globalUserCity = data[4]; 
			setUser()
			resizePage();
		});
	}
	this.getUser = getUser;
	function setUser(){
		notebook.echoData($.globalUserBuilding);
		//HEADER:
		header.getUserBuildingsSum($.globalUser, $.globalUserOnBuildingProcess);
		header.getUserRep($.globalUser);
		header.getCompanyDetails($.globalUser);
		header.setProfit($.globalUser.profit);
		header.setMaxMoney($.globalUser.maxMoney);
		header.showUpgradOrText($.globalUserBuilding);

		runningTimes.showBuildingsOnBuildingProocess($.globalUserOnBuildingProcess);
		
		if (typeof vmap.map == 'undefined') {
			vmap.ctor($.globalUserCity[0])
		}
		map_lookAround.showBuildingsOnTheMap();
		
		if($.globalUser.mentor>7){
			feed.showPage();
		}
		else{
			feed.hidePage();
		}

		setTimeout(function(){
			mentor.showPage();
		},1000)
		// chat.listen();

		clearInterval($.headerSetMoney);
		$.headerSetMoney = setInterval(function(){
			updateMoney($.globalUser.money, $.globalUser.profit, $.globalUser.lastLogin, $.globalUser.maxMoney);
		},1000);
	}
	
	function updateMoney(money,profit,lastLogin,maxMoney){
		
		lastLogin = new Date(lastLogin);
		var utc = new Date(lastLogin.getUTCFullYear(),lastLogin.getUTCMonth(), lastLogin.getUTCDate() , lastLogin.getUTCHours(), lastLogin.getUTCMinutes(), lastLogin.getUTCSeconds(), lastLogin.getUTCMilliseconds());
		lastLogin = utc.getTime() / 1000

		var now = new Date(); 
		var utc = new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
		now = utc.getTime() / 1000

		var addMoney = formulas.calculateMoney(now,lastLogin,profit)
		var updateMoney = money + addMoney;

		if(maxMoney<updateMoney){
			updateMoney = maxMoney;
		}

		header.setMoney(updateMoney,maxMoney);
	}
	
	var showDasInFirstTime = 1;
	this.showDasInFirstTime = showDasInFirstTime;
	function showDashboard(){
		globalHide();
		
		if(showDasInFirstTime==1){
			showDasInFirstTime=0
		}
		else{
			mentor.showPage();
		}
		
		vmap.showPage();
		addBuilding.showPage();
		header.showBottomHeader();
		bgElements.showPage()
		feed.showPage();
	}
	this.showDashboard = showDashboard;

	function api(url,data,callback){
		// url = "http://127.0.0.1:3000" + url;
		url = $.rootUrl  + url
		data.session = $.cookie("session");

		$.ajax({
			type: 'GET',
			url: url,
			data: data,
			dataType: 'text',
			success: function(data) {
				var checkMinus10 = (data[0] + data[1] + data[2]);

				if(data == "-1"){
					logOut()
				}
				else if(checkMinus10 == "-10"){
					alert("שגיאה לא ידועה : " + data)
				}
				else{
					callback(data)
				}
			},error:function(){
			}
		});
	}
	this.api = api;

	function logOut(){
		globalHide();
		$.cookie("session", "");
		login.showPage();
		
		//location.href = "";
	}
	this.logOut = logOut;

	function pad(num) {
		return ("0" + num).slice(-2);
	}

	function formatDate(d) {
		return [d.getUTCFullYear(), 
				pad(d.getUTCMonth() + 1), 
				pad(d.getUTCDate())].join("-") + " " + 
				[pad(d.getUTCHours()), 
				pad(d.getUTCMinutes()), 
				pad(d.getUTCSeconds())].join(":") + "";
	}
	this.formatDate = formatDate;
}
