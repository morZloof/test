var global = new globalJs()
//  $.rootUrl =  "http://84.95.248.51"
$.rootUrl =  "http://localhost:3000"

function globalJs(){
	
	function main(){
		getUser();
	}
	this.main = main;
	
	function globalHide(){
		$(".global_hide").hide();
	}
	this.globalHide = globalHide;

	function getUser(){

		var data = {};
		var url = '/api/users/getMyUser/';

		api(url, data, function(data) {
			data = JSON.parse(data);
			$.globalUser = data[0]; 

			header.headerEchoUserName($.globalUser)
			pages.checkPage()
		});
	}
	this.getUser = getUser;
	
	function api(url,data,callback){
		// url = "http://127.0.0.1:3000" + url;
		if(url == '/api/allDispute/getAllDispute' /*|| url=='/api/allDispute/getFav/'*/){
			url = $.rootUrl  + url
		}
		else {
			url = $.rootUrl  + url
			data.session = $.cookie("session");
		}

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
	
	function getLanguage(page,callback){
		var url = 'www/xml/' + page + '_heb.xml';
		
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'xml',
			success: function(data) {
				callback(data)
				
			},error:function(){
			}
		});
	}
	this.getLanguage = getLanguage;
	
	function logOut(){
		clearInterval(dispute.disputeInterval)
		clearInterval(dispute.privateChatInterval)
		clearInterval(dispute.privateChatIntervalSecondChat)
		//alert()
		if($('.login').is(":visible")==false){
			globalHide();

			$(".header_greeting_name_logIn").hide()
			$(".header_greeting_name_logOut").show()
			$.cookie("session", "");

			vmain.showPage()
		}
	}
	this.logOut = logOut;
}
