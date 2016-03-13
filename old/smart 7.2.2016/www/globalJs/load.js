$(function(){
	ctor();
	function ctor(){
		load_header();
		load_login();
		loadAddBuilding();
		loadFeed();
		loadMap();
		loadYoutube()
		loadCompany();
		loadPetek();
		loadRunningTimes();
		loadPayment();
		loadProfile();
		loadMentor()
		loadChat()
		loadUpgradeBuilding()
		loadBgElements();
		loadSearchResults();
		loadNotebook();
		loadWar();
		loadPopup();
		loadChoicePopup();
		loadAlert();
		loadRank()
	}
	function load_header(){
		$(".global_page_header").load("www/header/header.html", function() {
			header.ctor();
            header_notifcations.ctor();
		});	
	}
	function loadChat(){
		$(".global_page_chat").load("www/pages/chat/chat.html", function() {
			chat.ctor();
		});	
	}
	function loadRank(){
		$(".global_page_rank").load("www/pages/rank/rank.html", function() {
			rank.ctor();
		});
	}
	
	function loadNotebook(){
		$(".global_page_notebook").load("www/pages/notebook/notebook.html", function() {
			notebook.ctor();
		});	
	}
	function loadWar(){
		$(".global_page_war").load("www/pages/war/war.html", function() {
			war.ctor();
		});	
	}
	function load_login(){
		$(".global_page_login").load("www/pages/login/login.html", function() {
			login.ctor();
		});	
	}
	function loadPetek(){
		$(".global_page_petek").load("www/pages/petek/petek.html", function() {
			petek.ctor();
		});	
	}
	function loadAddBuilding(){
		$(".global_page_addBuilding").load("www/pages/addBuilding/addBuilding.html", function() {
			addBuilding.ctor();
		});	
	}
	function loadYoutube(){
		$(".global_page_youtube").load('www/pages/youtube/youtube.html',function(){
			youtube.ctor();
		})
	}
	function loadCompany(){
		$(".global_page_company").load("www/pages/company/company.html", function() {
			company.ctor();
		});	
	}
	function loadProfile(){
		$(".global_page_profile").load("www/pages/profile/profile.html", function() {
			profile.ctor();
		});	
	}
	function loadUpgradeBuilding(){
		$(".global_page_upgradeBuilding").load("www/pages/upgradeBuilding/upgradeBuilding.html", function() {
			upgradeBuilding.ctor();
		});	
	}
	
	function loadFeed(){
		$(".global_page_feed").load("www/pages/feed/feed.html", function() {
			feed.ctor();
			// feed.showPage();
		});	
	}
	function loadRunningTimes(){
		$(".global_page_runningTimes").load("www/pages/runningTimes/runningTimes.html", function() {
			runningTimes.ctor();
			runningTimes.showPage();
		});	
	}
	function loadPayment(){
		$(".global_page_payment").load("www/pages/payment/payment.html", function() {
			payment.ctor();
		});	
	}
	function loadMap(){
        setTimeout(function(){
            $(".global_page_map").load("www/pages/map/map.html", function() {
                $(".global_page_map").show()
                // vmap.ctor(); // WE CALL IT ON GLOBAL.JS
                global.main();
                map_click.ctor();
                
                setTimeout(function(){
                    map_findStreetName.initMap();
                },1000)
            });
        },1000)
	}
	
	function loadMentor(){
		$(".global_page_mentor").load("www/pages/mentor/mentor.html", function() {
			mentor.ctor();
		});
	}
	
	function loadBgElements() {
		$(".global_page_bgElements").load("www/pages/bgElements/bgElements.html", function() {
			bgElements.ctor();
		});
	}
	function loadSearchResults()  {
		$(".global_page_searchResults").load("www/pages/searchResults/searchResults.html", function() {
			searchResults.ctor();
		});
	}
	function loadPopup()  {
		$(".global_page_popup").load("www/pages/popup/popup.html", function() {
			popup.ctor();
		});
	}
	function loadChoicePopup() {
		$(".global_page_choicePopup").load("www/pages/choicePopup/choicePopup.html", function() {
			choicePopup.ctor();
		});
		
	}
	function loadAlert()  {
		$(".global_page_alert").load("www/pages/alert/alert.html", function() {
			valert.ctor();
		});
	}
}) 