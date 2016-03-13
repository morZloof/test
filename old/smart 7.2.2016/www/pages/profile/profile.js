var profile = new profileJs()
function profileJs(){
	function ctor(){
		$('.profile_bg, .profile_close').click(hidePage);
		$('.profile_holder_name').click(sendCompanyId)
		
		$(".profile_holder_openChat").click(openChat);
		$(".profile_holder_companyName span").click(goToClan);
	}
	this.ctor = ctor;
	
	function showPage(userId) {
		$('.global_page_profile').show();
		showData(userId)
	}
	this.showPage = showPage;
	
	function hidePage() {
		$('.global_page_profile').hide();
	}
	
	function goToClan(){
		var clanId = $(".profile_holder_companyID").text()
		company.showPage(clanId)
	}

	function showData(userId){
		getUserDetailsFromId(userId)
	}
	this.showData = showData;
	
	function openChat(){
		var otherUserId = $(".profile_holder_id").text();
		var otherUserName = $(".profile_holder_userName span").text()
		
		$(".global_page_profile").hide()
		chat.openChat(otherUserId,otherUserName)
	}
	
	function getUserDetailsFromId(id) {
		var data = {
			userId: id
		}
		
		var url = "/api/users/getUserDetailsFromId/"
		global.api(url,data,function(data){
			echoUserDetails(data);
		})
	}
	
	function echoUserDetails(data) {
		var userData = JSON.parse(data);
		userData = userData[0]
			
		$('.profile_holder_title').text(userData.userName);

		$('.profile_holder_rank span').text(userData.rank);
		$('.profile_holder_profit span').text(userData.profit);
		
		if(userData.companys_name==null){
			$('.profile_holder_companyName').hide()
		}
		else{
			$('.profile_holder_companyName span').text(userData.companys_name);
		}
		
		$(".profile_holder_id").text(userData.id)
		$('.profile_holder_companyID').text(userData.companys_id);
	}
	
	function sendCompanyId() {
		
		var companyId = $(this).parent().find('.profile_holder_companyID').text();
		company.showPage(companyId)
	}
}

