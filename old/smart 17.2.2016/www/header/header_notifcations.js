var header_notifcations = new header_notifcationsJS()
function header_notifcationsJS (){
	function ctor(){
        getNotifcations();
	}
	this.ctor = ctor;

	function getNotifcations() {
		var data = {}
		var url = "/api/header/notifications/"
		global.api(url,data,function(data){
			var json = JSON.parse(data);
				echoGetNotifcations(json);
		})
		
	}
	this.getNotifcations = getNotifcations;
	function echoGetNotifcations(item) {
        console.log(item)      
		if(item != null) {
			var numOfReq = item.length;
            var newReqCounter = 0;
            for (var i=0; i<numOfReq; i++) {
                if (item[i].vread == 0)
                    newReqCounter++;
            }
			if (newReqCounter > 0) {
				$('.header_cont_notafications_count').text(newReqCounter);
				$('.header_cont_notafications_count').show();
			}
            $('.header_cont_notafications').click(showNotafications)
			$('.header_cont_notafications_list_row').hide();
			for (var i=0; i<numOfReq; i++) {
				var oneReq = $(".header_cont_notafications_list_row:first").clone()
				var reqUserId = item[i].users_id;
				var name = item[i].name;
                var msg; 
                var approveText;
                var cancelText;
				if (item[i].type_id == 1) {
                    //id 1: new attack req the user need to corfim/cancel
                    msg = 'שלח לך הצעת מחיר'
                    approveText = 'צפה'
                    // approveText = 'אישור'
                    // cancelText = 'ביטול'    

                    oneReq.find('.header_cont_notafications_list_row_aprrove').click({reqId:item[i].id, otherId:item[i].other},showQuote);
                    // oneReq.find('.header_cont_notafications_list_row_cancel').click({reqId:item[i].id},cancelQuote);
                }
                if (item[i].type_id == 2) {
                    //id 2; someone try to steal your resturant
                    msg = 'מנסה לגנוב לך לקוחות'
                    approveText = 'אישור'
                    // cancelText = 'ביטול'
                }
                if (item[i].type_id == 3) {
                    //id 3: someone comfirm your send attack
                    msg = 'אישר את הצעת המחיר'
                    approveText = 'אישור'
                }
                if (item[i].type_id == 4) {
                   //id 4: someone cancel your send attack
                    msg = 'סירב להצעת המחיר'
                    approveText = 'אישור'
                   
                }
                if (item[i].type_id == 5) {
                   //id 5: someone send a company req
                    msg = 'ביקש להצטרף לתאגיד'
                    approveText = 'אישור'
                    cancelText = 'ביטול';
                    
                    oneReq.find('.header_cont_notafications_list_row_aprrove').click({param1: item[i].id},acceptNotifcations);
                    oneReq.find('.header_cont_notafications_list_row_cancel').click({param1: item[i].id},removeNotifcations);
                }
                if (item[i].type_id == 6) {
                   //id 6: company comfirm req 
                    msg = 'אישר את בקשת ההצטרפות שלך'
                    approveText = 'אישור'
                                   
                }
                if(typeof cancelText == "undefined") 
                    oneReq.find('.header_cont_notafications_list_row_cancel').hide();
                if (item[i].vread == 0) {
                    oneReq.css('background','#edeff5');
                }
                else {
                    oneReq.css('background','default');
                    
                }
                oneReq.click({param1: item[i].id},markAsRead)
				oneReq.find('.header_cont_notafications_list_row_aprrove').text(approveText);
				oneReq.find('.header_cont_notafications_list_row_cancel').text(cancelText);
				oneReq.find('.header_cont_notafications_list_row_msg').text(msg);
				oneReq.find('.header_cont_notafications_list_row_userName').text(name);
                
				$(".header_cont_notafications_list").append(oneReq);
				oneReq.show();
			}
		}		
	}
    
	function showQuote(event) {
		var reqId = event.data.reqId;
		var userId = event.data.otherId;
		var data = {store_id: userId}
        
		var url = "/api/war/getRestuarantsBid/"
		global.api(url,data,function(data){
				echoShowQuote(JSON.parse(data), reqId);
		})
	}
    
    function echoShowQuote(data, reqId) {
        console.log(data)
        console.log(reqId)
        war.showRequest(data,reqId);
    }
    
	function showNotafications(){
		$('.header_cont_notafications_list').toggle();
	}
    
	function acceptNotifcations(event) {
		var userId = event.data.param1;
		
		var data = {notification_id: userId}
		var url = "/api/company/confirmReq/"
		global.api(url,data,function(data){
				echoAcceptNotifcations(data);
		})
	}
	
	function echoAcceptNotifcations(json) {
		console.log(json)
		if (json == 'sucsses') {
            popup.showPage('המשתמש נוסף לתאגיד')
        }
        else {
            valert.showPage('ארעה שגיאה')
        }
		var numOfReq = $('.header_cont_notafications_count').text();
		numOfReq--;
		if (numOfReq > 0) {
			$('.header_cont_notafications_count').text(numOfReq);
		}
		else {
			$('.header_cont_notafications_count').hide();		
		}
		getNotifcations();
	}
	
	function removeNotifcations(event) {
		var userId = event.data.param1;
		
		var data = {notification_id: userId}
		var url = "/api/company/cancelReq/"
		global.api(url,data,function(data){
			echoRemoveNotifcations(data);
		})
	}
	
	function echoRemoveNotifcations(json) {
		console.log(json)
		
		var numOfReq = $('.header_cont_notafications_count').text();
		numOfReq--;
		if (numOfReq > 0) {
			$('.header_cont_notafications_count').text(numOfReq);
		}
		else {
			$('.header_cont_notafications_count').hide();		
		}
		getNotifcations();
	}
    
    function acceptQuote(event) {
		var reqId = event.data.reqId;
		var data = {notification_id: reqId}
		var url = "/api/war/comfirmReq/"
		global.api(url,data,function(data){
			echoAcceptQuote(data);
		})
    }
    
    function echoAcceptQuote(data) {
        console.log(data)
    }
    function cancelQuote(event) {
		var reqId = event.data.reqId;
		
		var data = {notification_id: reqId}
		var url = "/api/war/cancelReq/"
		global.api(url,data,function(data){
			echoCancelQuote(data);
		})
    }
    
    function echoCancelQuote(data) {
        console.log(data)
    }
    
	function markAsRead(event) {
		var userId = event.data.param1;
		
		var data = {notification_id: userId}
		var url = "/api/header/readNotifications/"
		global.api(url,data,function(data){
				echoMarkAsRead(data);
		})
	}
	
	function echoMarkAsRead(json) {
		var numOfReq = $('.header_cont_notafications_count').text();
		numOfReq--;
		if (numOfReq > 0) {
			$('.header_cont_notafications_count').text(numOfReq);
		}
		else {
			// $('.header_cont_notafications_count').hide();		
		}
        // getNotifcations();  
	}

}
	