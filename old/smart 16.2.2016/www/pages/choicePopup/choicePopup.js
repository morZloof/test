var choicePopup = new choicePopupJs()
function choicePopupJs(){
	function ctor(){
		$('.choicePopup_x').click(closePage);
		
		$('.choicePopup_btn_approveReputation').click(sendToApi);
		$('.choicePopup_btn_cancel').click(closePage);
	}
	this.ctor = ctor;
	
	function showPage(text, callback) {
		$('.choicePopup_btn_approve').unbind('click');
		$('.choicePopup_btn_cancel').unbind('click');
		
		$('.choicePopup_btn_approve').click(function() {
			callback(1)
			closePage();
		});
		
		$('.choicePopup_btn_cancel').click(function() {
			callback(0)
			closePage();
		});
		
		$('.choicePopup_text').text(text);
		$('.global_page_choicePopup').fadeIn();
		$('.global_pagesFixed').css('-webkit-filter','blur(5px)')
	}
	this.showPage = showPage;
	
	// kind: send the kind of the popup
	function showPageReputation(kind,endTime,buildingId) {
		$(".choicePopup_btn_approveReputation_error").hide();
		
		var reoutationCost = getReputation(endTime);
		
		$(".choicePopup_btn_reputation_buildingId").text(buildingId);
		$(".choicePopup_btn_approveReputation_number").text(reoutationCost);
		
		$(".choicePopup_btn_normal").hide()
		$(".choicePopup_btn_reputation").show()
		
		if(kind==1){
			var text = 'האם תרצה לסיים את הבניה בעזרת מוניטין?'
		}		
		
		$('.choicePopup_text').text(text);
		$('.global_page_choicePopup').fadeIn();
		$('.global_pagesFixed').css('-webkit-filter','blur(5px)');
		
		startIntervalReputation(endTime)
	}
	this.showPageReputation = showPageReputation;
	
	// update the reputation on the button every second
	function startIntervalReputation(endTime){
		setTimeout(function(){
			if($(".global_page_choicePopup").is(":visible") == true){
				startIntervalReputation(endTime)
			} 
		},2000)
		
		var reoutationCost = getReputation(endTime);

		$(".choicePopup_btn_approveReputation_number").text(reoutationCost);
	}
	
	function getReputation(endTime){
		endTime = new Date(endTime).getTime() / 1000;
		var nowTime = new Date();
		nowTime = new Date(nowTime.getUTCFullYear(), nowTime.getUTCMonth(), nowTime.getUTCDate(),  nowTime.getUTCHours(), nowTime.getUTCMinutes(), nowTime.getUTCSeconds()).getTime() / 1000;
		
		var secondsLeft = endTime - nowTime;
		var reoutationCost = formulas.time(secondsLeft);
		
		return reoutationCost;
	}
    this.getReputation = getReputation;
    
	function closePage() {
		$('.global_page_choicePopup').fadeOut();
		$('.global_pagesFixed').css('-webkit-filter','blur(0px)')
	}
	
	function sendToApi(){
		var buildingId = $(".choicePopup_btn_reputation_buildingId").text()
		
		var data = {
			usersBuildings_id: buildingId
		}

		var url = "/api/reputation/finishBuildTime/"
		global.api(url,data,function(data){
			if(data=="error: not enough reputation"){
				$(".choicePopup_btn_approveReputation_error").fadeIn()
			}
			else{
				global.getUser()
				closePage()
			}
		})
	}
}
