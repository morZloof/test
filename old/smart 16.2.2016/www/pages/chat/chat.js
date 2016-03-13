var chat = new chatJs()
function chatJs() {
	var socket = {}
	function ctor(){
		$(".chatBox_title").click(toggleChat);
		$(".chatBox").click(focusTextarea);
		
        // listen()
		showPage();
	}	
	this.ctor = ctor;
    
	function showPage() {
		$(".global_page_chat").show();
        getData();
	}
	this.showPage = showPage;
    	
	function closeChat(){
		var otherUsers_id = $(this).parent().parent().find(".chatBox_sendBox_otherUserId").text()
		$(this).parent().parent().remove()
		
		var url = '/api/chat/closeChat/';
		var data = {
			otherUsers_id: otherUsers_id
		};
		
		chatApi(url,data,function(data){
			var json = JSON.parse(data);
			$(this).parent().parent().remove()
		})
	}
    
    function listen(){
        /*
        var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            "timeout" : 10000, //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"]
        };

        socket = io("ur-node-server-domain", connectionOptions);
        socket = io('http://localhost:3001');
		// socket = io.connect('http://127.0.0.1:3001');

		socket.emit('join',{id:$.globalUser.id})
		socket.on('chat message', function(json){
            
			// if(chat1 == json.otherUsersId){
				var div = $(".chat:first")
			// }
			
			// if(chat2 == json.otherUsersId){
			// 	var div = $(".chat1")
			// }
			var msg = json.msg
			echoReceiveMessage(msg,div,0);
		});*/
	}
	this.listen = listen;
	
	function openChat(otherUserId,otherUserName){
		// alert(otherUserId + " 1 " + otherUserName);
		
		var otherUsers_id = $(this).parent().parent().find(".chatBox_sendBox_otherUserId").text()
		
		$(this).parent().parent().remove()
		
		var url = '/api/chat/openChat/';
		var data = {
			otherUsers_id: otherUserId,
			otherUsers_name: otherUserName
		};
		
		chatApi(url,data,function(data){
			var json = JSON.parse(data);
			echoData(json);
		})
	}
	this.openChat = openChat;
	
	function getData(){
		var url = '/api/chat/getChat/';
		var data = {};
		
		chatApi(url,data,function(data){
			var json = JSON.parse(data);
			
			echoData(json);
		})
	}

	var chat1 = 0;
	var chat2 = 0;
	function echoData(json){
		var loopLength = json.length;
		
		if(loopLength == 1)
		{
			$(".chat").show()
			$(".chat").find(".chatBox_title_userName").text(json[0].otherUsers_name)
			$(".chat").find(".chatBox_sendBox_otherUserId").text(json[0].otherUsers_id)
			
			var div = $(".chat:first");
			var otherUsers_id = json[0].otherUsers_id
			chat1 = json[0].otherUsers_id;
			getChatContent(div,otherUsers_id)
		}
		else if(loopLength>1){
			$(".chat").show()
			$(".chat").find(".chatBox_title_userName").text(json[0].otherUsers_name)
			$(".chat").find(".chatBox_sendBox_otherUserId").text(json[0].otherUsers_id)
			
			var div = $(".chat:first");
			var otherUsers_id = json[0].otherUsers_id
			chat1 = json[0].otherUsers_id;
			getChatContent(div,otherUsers_id)
			
			var clone = $(".chat").clone();
			clone.addClass("chat1");
			$(".chat1").remove();
			
			clone.show()
			$(".global_page_chat").append(clone)
			$(".chat1").find(".chatBox_title_userName").text(json[1].otherUsers_name)
			$(".chat1").find(".chatBox_sendBox_otherUserId").text(json[1].otherUsers_id)

			var div = clone;
			var otherUsers_id = json[1].otherUsers_id
			chat2 = otherUsers_id;
			getChatContent(div,otherUsers_id)
		}
		
		$(".chatBox_title_close").blur('click');
		$(".chatBox_title_close").click(closeChat);
		
		$(".chat").blur('click');
		$(".chat").click(focusTextArea);
		
		$(".chatBox_sendBox_textarea").blur('keypress');
		$('.chatBox_sendBox_textarea').keypress(checkEnter)
		$('.chatBox_sendBox_textarea').keypress(resizeTextarea)
		
		$(".chatBox_sendBox_send").blur('click');
		$(".chatBox_sendBox_send").click(prepareSendMessage);
	}
	
	function getChatContent(div,otherUsers_id){
		var url = '/api/chat/getChatContent/';
		var data = {
			otherUsers_id: otherUsers_id
		};
		
		chatApi(url,data,function(data){

			var json = JSON.parse(data);
			echoChatData(json,div);
		})
	}
	
	function echoChatData(json,div){
		var loopLength = json.length;
		
		for(var i=0; i<loopLength ;i++){
			var msg = json[i].msg;;
			var sendId = json[i].sendId;
			if(sendId == $.globalUser.id){
				echoSendMessage(msg,div,1)
			}
			else{
				echoReceiveMessage(msg,div,1)
			}
		}
		setTimeout(function(){ // need to delete
			div.find(".chatBox_text").animate({ scrollTop: 1000 }, 0);
		},1000)
	}
	
	function focusTextArea(){
		$(this).find("textarea").focus()	
	}
	
	function chatApi(url,data,callback){
		url = "http://localhost:3001" + url;

		data.session = $.cookie("session");

		$.ajax({
			type: 'GET',
			url: url,
			data: data,
			dataType: 'text',
			success: function(data) {
				var checkMinus10 = (data[0] + data[1] + data[2]);

				if(data == "-1"){
					console.log('chat error in function chatApi')
				}
				else if(checkMinus10 == "-10"){
					console.log('chat error in function chatApi')
				}
				else{
					callback(data)
				}
			},error:function(){
			}
		});
	}
	
	var resizeCounter = 0;
	function resizeTextarea(){
		if($(this).length<10){
			resizeCounter = 0;
			$(this).css("height","16px")
			$(this).parent().parent().find(".chatBox_sendBox").css("height","45px")
			$(this).parent().parent().find(".chatBox_text").css("height","266px")
		}
		
		if(resizeCounter<50){
			while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
				resizeCounter++;
				$(this).height($(this).height()+1);
				$(this).parent().parent().find(".chatBox_sendBox").height($(this).parent().parent().find(".chatBox_sendBox").height()+1);
				$(this).parent().parent().find(".chatBox_text").height($(this).parent().parent().find(".chatBox_text").height()-1);
			};
		}
	}
	
	function checkEnter(e){
		var code = (e.keyCode ? e.keyCode : e.which);
 		if(code == 13) {
			e.preventDefault();
			
			var div = $(this)
			sendMessage(div);	

			return false;
		}
	}
	
	function focusTextarea(){
		$(this).find(".chatBox_sendBox_textarea").focus()
	}
	
	function prepareSendMessage(){
		var div = $(this).parent().find(".chatBox_sendBox_textarea");
		sendMessage(div);	
	}
	function toggleChat(){
		$(this).parent().toggleClass("chatBoxHide");
		
		$(".chatBox_sendBox_textarea").focus()
	}
	
	function sendMessage(div){
		var msg = encodeURIComponent(div.val());

		if(msg.length>0){
			var chatDiv = div.parent().parent()
			echoSendMessage(msg,chatDiv,0);
			var otherUsersId = chatDiv.find(".chatBox_sendBox_otherUserId").text()

			div.parent().parent().find(".chatBox_sendBox_textarea").val("");
			div.parent().parent().find(".chatBox_sendBox_textarea").focus();

			// $(".chatBox_text").animate({ scrollTop: $(".chatBox_text").height() }, 200);

			socket.emit('chat message', {
				msg: msg, //msg
				otherUsersId:otherUsersId, //send id
				id: $.globalUser.id // my id
			});
		}
	}
	
	function echoReceiveMessage(msg,chatDiv,firstTime){
		msg = decodeURIComponent(msg);
		
		var clone = $(".chatBox_text_message:first").clone();
		clone.find(".chatBox_text_message_text").text(msg);
		if(firstTime==0){
			chatDiv.find(".chatBox_text").animate({ scrollTop: chatDiv.find(".chatBox_textHolder").height() }, 200);
		}
		
		clone.show();
		chatDiv.find(".chatBox_textHolder").append(clone);
	}
	function echoSendMessage(msg,chatDiv,firstTime){
		msg = decodeURIComponent(msg);
		var clone = $(".chatBox_text_messageMy:first").clone();
		clone.find(".chatBox_text_messageMy_text").text(msg)
		
		clone.show();
		if(firstTime==0){
			chatDiv.find(".chatBox_text").animate({ scrollTop: chatDiv.find(".chatBox_textHolder").height() }, 200);
		}
		chatDiv.find(".chatBox_textHolder").append(clone);
	}
}