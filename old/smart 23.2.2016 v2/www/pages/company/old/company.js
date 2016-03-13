var company = new companyJs()
function companyJs(){
	function ctor(){
		$('.company_new_holder_close').click(closePage);
		$('.company_new_holder_accept').click(checkCompanyName)
        
        // setTimeout(function(){
        //     showPage(59)
        // },1000)
	}
	this.ctor = ctor;
	
	function showPage(clanId) {
		global.globalHide();
		$('.global_page_company').show();
		$('.company').show();
		showData(clanId);
	}
	this.showPage = showPage;
	
	function showData(userId){
		getClanDetailsFromId(userId)
	}
	
	function getClanDetailsFromId(id) {
			var data = {
				clanId: id
			}
			
			var url = "/api/company/getClanDetailsFromId/"
			global.api(url,data,function(data){
				echoClanDetails(data);
			})
	}
	
	function echoClanDetails(data) {
		data = JSON.parse(data);
		$('.company_main_users_text').hide();
		$('.company_title span').text(data[0][0].name)
		
		if ($.globalUser.companys_name == null) { // IF YOU DONT HAVE COMPANY
			$('.company_oneResult_btns_joinBtn').show();
			$('.company_oneResult_btns_joinBtn').click({clanid: data[0][0].id}, addRequest )
		}
		else { // IF YOU HAVE COMPANY
			if($.globalUser.companys_id == data[0][0].id) { // THIS IS YOUR CLAN
				$('.company_oneResult_btns_leaveBtn').show();
				$('.company_oneResult_btns_leaveBtn').click(leaveClan)
			}
		}
		

		var users = data[1];
		for (var i=0; i<users.length; i++) {
			var oneUser = $('.company_main_users_text:first').clone();
			oneUser.find('.company_main_users_text_userName span').text(users[i].userName);
			oneUser.find('.company_main_users_text_userName span').click({userId: users[i].id}, showUserProfile);
			oneUser.find('.company_main_users_text_profit span').text(users[i].profit);
			oneUser.find('.company_main_users_text_rank span').text(users[i].rank);
			
			if ($.globalUser.id != users[i].id) { // YOU ARE NOT THE USER IN THE LIST
				oneUser.find('.company_oneResult_btns_sendMsgBtn').show();
				oneUser.find('.company_oneResult_btns_sendMsgBtn').click({userId: users[i].id, userName: users[i].userName}, sendMsgToUser)
			}										
			if ($.globalUser.admin == 1 && $.globalUser.companys_id == data[0][0].id) {
				// IF YOU ARE ADMIN AND THIS IS YOUR CLAN
				
				if ($.globalUser.id != users[i].id) { // YOU ARE NOT THE USER IN THE LIST
					oneUser.find('.company_oneResult_btns_kickBtn').show();
					oneUser.find('.company_oneResult_btns_kickBtn').click({userId: users[i].id}, kickUser)
				}
			}
			
			$('.company_main_users').append(oneUser);
			oneUser.show();
		}
	}
	
	function addRequest(e) {
		var clanId = e.data.clanid;
		
		var data = {companyId: clanId}
		var url = "/api/company/sendReq/"
		global.api(url,data,function(data){
			echojoinToSearchCompany(data)
		})
	}
	function echojoinToSearchCompany(data) {
		if (data == 'sucsses') {
			popup.showPage('בקשתך נשלחה בהצלחה')
		}	
		if (data == 'you all ready send req') {
			popup.showPage('יש לך כבר בקשה ממתינה')
		}	
		if (data == 'you have country') {
			popup.showPage('לא ניתן להצטרף ליותר מברית אחת')
		}
	}
	
	function showPopupPage() {
		global.globalHide();
		$('.global_page_company').show();
		$('.company_new').show();
	}
	this.showPopupPage = showPopupPage;
	
	function createNewCompany() {
		var companyJs = buildingsJson.getJson(4).levels[0];
		var time = buildingsJson.getTime(4,1)

		var profit = companyJs.profit
		profit = help.addComma(profit);

		$(".company_new_holder_image").attr("src",companyJs.img);
		$(".company_new_holder_time span").html(time);

		$('.company_new_holder_data1 span').text(companyJs.price)
		$('.company_new_holder_data2 span').text(profit)
		
		//$('.company_new_holder_accept').click({pic: companyJs.img, price:companyJs.price}, aprroveBuildingCompany)
	}
	this.createNewCompany = createNewCompany;

	function checkCompanyName(){
		var url = "/api/company/checkCompanyName/";
		var companyName = $(".company_new_holder_input_companyName").val();

		var data = {
			companyName: companyName
		}

		global.api(url,data,function(data){
			if(data=='error: name exist'){
				valert.showPage('השם תפוס, אנא בחר שם אחר')
			}
			else{
				aprroveBuildingCompany()
			}
		})
	}

	function aprroveBuildingCompany(e) {
		var companyJs = buildingsJson.getJson(4).levels[0];

		global.globalHide();
		global.showDashboard();
		vmap.buyHouseAlert(companyJs.img, 4 ,companyJs.price)
	}
	function getNewCompanyName() {
		var companyName = $('.company_new input').val();
		return companyName;
	}
	this.getNewCompanyName = getNewCompanyName;
	
	function closePage() {
		global.globalHide();
		global.showDashboard();
	}
	
	function leaveClan() {
		var url = "/api/company/leaveCompany/"
		var data = {}
		global.api(url,data,function(data){
			global.showDashboard();
			popup.showPage('עזבת את התאגיד בהצלחה')
			
			global.getUser();
			$('.header_cont_company').unbind('click');
			
			$('.header_cont_company').text('צור תאגיד')
			$('.header_cont_company').click(header.createCompany);
			
		})
	}
	
	function kickUser(e) {
		var text = 'האם אתה רוצה להסיר את המשתמש מהתאגיד?'
		choicePopup.showPage(text, function(yesNo) {
			if (yesNo) {
				var userId = e.data.userId;
				
				var data = {user_id: userId}
				var url = "/api/company/removeUserFromCompany/"
				global.api(url,data,function(data){
					echoKickUser(data)
				})
			}
		});
		
	}
	
	function echoKickUser(data) {
			popup.showPage('הסרת את המשתמש מהתאגיד')
			showPage($.globalUser.companys_id);
		
	} 
	
	function showUserProfile(e) {
		var userId = e.data.userId;
		profile.showPage(userId);
	}
	
	function sendMsgToUser(e) {
		var userId = e.data.userId;
		var userName = e.data.userName;
		chat.openChat(userId,userName);
				
	}
	
}