var searchResults = new searchResultsJs()
function searchResultsJs(){
	function ctor(){
		checkIfEnter();
		$('.header_searchCompany_btn').click(showSearced)
	}
	this.ctor = ctor;
	
	function showPage(searched){
		global.globalHide();
		$(".global_page_searchResults").show()
		sendToApi(searched)
	}
	this.showPage = showPage;
	
	function checkIfEnter() {
		$('#header_searchCompany_input').keypress(function (e) {
			if (e.which == 13) {
				var searched = $('#header_searchCompany_input').val();
				showPage(searched);
				return false;    //<---- Add this line
			}
		});
	}
	
	function showSearced() {
		var searched = $('#header_searchCompany_input').val();
		showPage(searched);	
	}
	
	function sendToApi(searched) {
		$('.searchResults_title span').text(searched);
		var data = {
			searchQuery:searched
		}

		var url = '/api/header/search/';
		
		global.api(url,data,function(data){
			
			var json = JSON.parse(data)

			showSearchResults(json);
		})
		
	}
	
	function showSearchResults(json) {
		$('.searchResults_oneUserResult').hide();
		$('.searchResults_oneClanResult').hide();
		
		//FIRST ELEMENT IS USERS
		var loopLength = json[0].length;
		$('.searchResults_numOfUsersResult span').text(loopLength);
		for (var i=0; i<loopLength; i++) {
			var oneUser = $('.searchResults_oneUserResult:first').clone();
			oneUser.find('.searchResults_oneResult_title_name').text(json[0][i].userName)
			oneUser.find('.searchResults_oneResult_btns_viewProfile').click({userId: json[0][i].id}, sendToShowProfile)
			$('.searchResults_main_users').append(oneUser)
			oneUser.show();
		}
		// SECOND ELEMENT IS CLANS
		loopLength = json[1].length;
		$('.searchResults_numOfClansResult span').text(loopLength);
		for (var i=0; i<loopLength; i++) {
			var oneClan = $('.searchResults_oneClanResult:first').clone();
			oneClan.find('.searchResults_oneResult_title_name').text(json[1][i].name)
			oneClan.find('.searchResults_oneResult_details_Rank .searchResults_oneResult_details_oneField_value').text(json[1][i].rank)
			oneClan.find('.searchResults_oneResult_details_power .searchResults_oneResult_details_oneField_value').text(json[1][i].power)
			oneClan.find('.searchResults_oneResult_btns_showCompany').click({clanId: json[1][i].id},sendCompayId)
			$('.searchResults_main_Clans').append(oneClan)
			oneClan.show();
		}
	}
	
	function sendToShowProfile(e) {
		profile.showPage(e.data.userId)
	}
	
	function sendCompayId(e) {
		company.showPage(e.data.clanId)
	}
}
