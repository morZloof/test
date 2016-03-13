var feed = new feedJs()
function feedJs() {
	function ctor(){
		$('.feed_cont_replybox_btnBig').click(addBigMessage);
		$(window).scroll(scrollFeed);
		
		$(".feed_cont_sendBigMessage").click(showBigReplyBox);
		$(".feed_cont, .feed_cont_sendBigMessage_close").click(hideBigReplyBox);
		
		$(".feed").click(scrollFeedToTop);
		
		// scrollFeedToTop();
	}
	this.ctor = ctor;

	function showPage() {
		$(".global_page_feed").show()
		getData();
	}
	this.showPage = showPage;

	function hidePage() {
		$(".global_page_feed").hide()
	}
	this.hidePage = hidePage;

	function scrollFeedToTop(){
		$("html, body").animate({ scrollTop: "2000" },1000);
	}
	
	function showReply(){
		var div = $(this)
		div.parent().parent().find(".feed_cont_replybox_hide").slideDown()	
		setTimeout(function(){
			div.hide()
		},200)
	}
		
	function hideReply(){
		$(this).parent().parent().find(".feed_cont_replybox_hide").slideUp();
		$(this).parent().parent().find(".feed_cont_replybox_text_replay").show()
	}
	
	var newMessageOpen = 0;
	function showBigReplyBox(){
		if(newMessageOpen == 0){
			setTimeout(function(){
				newMessageOpen = 1;
			},100)

			$(".feed_cont_replybox_inputBigMessage").focus()
			$(".feed_cont_sendBigMessage_close").fadeIn()
			$(".feed_cont_sendBigMessage").css("bottom","45px")
		}
	}
	function hideBigReplyBox(){
		if(newMessageOpen == 1){
			setTimeout(function(){
				newMessageOpen = 0;
			},100)
		
			$(".feed_cont_replybox_textarea, .feed_cont_replybox_input").val("")
			$(".feed_cont_sendBigMessage_close").fadeOut()
			$(".feed_cont_sendBigMessage").css("bottom","-120px")
		}
	}
	
	function addSmallMessage(){
		$(".feed_cont_replybox_miniError").hide()
		
		var id = $(this).parent().parent().parent().find(".feed_cont_oneMessage_id").text()
		var date = global.formatDate(new Date());
		var title = $(this).parent().find(".feed_cont_replybox_input_addSmallMessage").val();
		title = encodeURIComponent(title);
		var text =  $(this).parent().find(".feed_cont_replybox_textarea1").val();
		text = encodeURIComponent(text);
		
		if(title.length<3){
			$(".feed_cont_replybox_miniError").show()
		}
		else{
			$(".feed_cont_replybox_miniError").hide()
				
			var data = {
				id: id,
				title: title,
				text: text,
				date: date
			}
	
			var url = "/api/feed/addSmallMessage/"
			global.api(url,data,function(data){
				getData()
			})
		}
	}
	
	function addBigMessage(){
		$(".feed_cont_replybox_error").hide();

		var date = global.formatDate(new Date());
		var title = encodeURIComponent($(".feed_cont_replybox_inputBigMessage").val());
		var text = encodeURIComponent($(".feed_cont_replybox_textarea2").val());

		var data = {
			title:title,
			text: text,
			date: date
		}
		
		if(title.length<3){
			$(".feed_cont_replybox_error").show();
		}
		else{
			$(".feed_cont_replybox_error").hide();
			var url = "/api/feed/addBigMessage/"
			global.api(url,data,function(data){
				getData();
				hideBigReplyBox();
			})
		}
	}
	
	var likes = {}
	function getData(){
		var data = {}
		
		var url = "/api/feed/getFeed/"
		global.api(url,data,function(data){
			var json = JSON.parse(data);
			
			likes = json[1];
			echoData(json[0]);
		})	
	}
	
	function checkLike(feed_id){
		var json = likes;
		var loopLength = json.length
		
		for(var i=0; i<loopLength ;i++)
		{
			if(json[i].id==feed_id){
				return 1;
			}
		}
		
		return 0;
	}
	
	function echoData(json){		
		var loopLength = json.length;
		
		var clone = $(".feed_cont_oneMessage:first").clone()
		$(".feed_cont_oneMessage").remove()
		$(".feed_cont").append(clone);
		
		for(var i=0; i<loopLength ;i++){
			var clone = $(".feed_cont_oneMessage:first").clone()
			
			var title = decodeURIComponent(json[i].title); 
			var text = decodeURIComponent(json[i].text);
			var date = convertTime(json[i].date);
			var userLike = checkLike(json[i].id)

			clone.find(".feed_cont_replybox_data_date_text").text(date);
			clone.find(".feed_cont_oneMessage_autherName").text(json[i].userName);
			clone.find(".feed_cont_oneMessage_title_text").text(title);
			clone.find(".feed_cont_replybox_text").text(text);
			clone.find(".feed_cont_oneMessage_id").text(json[i].id);
			clone.find(".feed_cont_oneMessage_autherDetails").text("[תאגיד: " + json[i].companys_name + "]");
			clone.find(".feed_cont_oneMessage_numOfThumbs").text(json[i].likes);
			
			if(json[i].companys_name == null){
				clone.find(".feed_cont_oneMessage_autherDetails").hide()
			}
			
			var padding = 25 * json[i].num;	
			clone.css("padding-right",padding + "px");
			
			if(json[i].small_id == 0){
				clone.css("margin-top","18px")
				
				clone.find(".feed_cont_oneMessage_title").addClass("feed_cont_oneMessage_titleAddClass");
				clone.find(".feed_cont_oneMessage_numOfComments").text(json[i].comments);
				clone.find(".feed_cont_comments_btn").show()
				
				if($.globalUser.admin==2){
					clone.find(".feed_cont_replybox_text_trashHolder").show()
				}
			}
			var next_i = i+1;
			if(next_i>loopLength){
				next_i = i;
			}
			
			$(".feed_cont").append(clone);
			clone.show()
			
			if(userLike==1){
				clone.find(".feed_cont_comments_btn_likeIcon").addClass("feed_cont_comments_btn_likeIconAddClass")
			}
		}
			
		
		$(".feed_cont_btnSmall").blur("click");
		$('.feed_cont_btnSmall').click(addSmallMessage);

		$(".feed_cont_oneMessage_title").blur("click");
		$(".feed_cont_oneMessage_title").click(showBigMessage);

		$(".feed_cont_replybox_text_replay").blur("click");
		$(".feed_cont_replybox_text_replay").click(showReply);
		
		$(".feed_cont_replybox_hide_close").blur("click");
		$(".feed_cont_replybox_hide_close").click(hideReply);
		
		$(".feed_cont_replybox_text_trash").blur("click")
		$(".feed_cont_replybox_text_trash").click(trashMessage);
		
		$(".feed_cont_like_btn").blur("click");
		$(".feed_cont_like_btn").click(doLike);
	}
	
	function doLike(){
		var feed_id = $(this).parent().parent().find(".feed_cont_oneMessage_id").text()
		
		var url = "/api/feed/doLike/"
		var data = {
			feed_id: feed_id
		}
		
		var div = $(this);
		
		if(checkLike(feed_id)==0){		
			global.api(url,data,function(data){
				var numberOfLikes = parseInt(div.find(".feed_cont_oneMessage_numOfThumbs").text())+1;
				$(".feed_cont_oneMessage_numOfThumbs").text(numberOfLikes)
				div.find(".feed_cont_comments_btn_likeIcon").addClass("feed_cont_comments_btn_likeIconAddClass")
				
				var json = JSON.parse(data);
				
				echoData(json);
			})
		}
	}
	
	function trashMessage(){
		var msg_id = $(this).parent().parent().parent().parent().find(".feed_cont_oneMessage_id").text()
		
		var url = "/api/feed/deleteComment/"
		var data = {
			msg_id: msg_id
		}
		
		global.api(url,data,function(data){
			var json = JSON.parse(data);
			likes = json[1]

			echoData(json[0]);
		})
	}
	
	function convertTime(date){
		var date = new Date(date);
		
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		
		var newDate = hour + ":" + minute + " " + day + "/" + month + "/" + year;
		return newDate;
	}
	
	function showBigMessage(){
		// $(".feed_cont_replybox").slideUp()
		$(this).parent().find(".feed_cont_replybox").slideToggle()
	}
	
	var startTop = $(window).scrollTop();
	function scrollFeed(){
		var fromTop = $(window).scrollTop() - startTop;
		
		if(fromTop>200 && fromTop<250){
			$(".global_pagesFixed").css("-webkit-filter","blur(1px)");
		}
		else if(fromTop>249 && fromTop<300){
			$(".global_pagesFixed").css("-webkit-filter","blur(2px)");
		}
		else if(fromTop>299 && fromTop<400){
			$(".global_pagesFixed").css("-webkit-filter","blur(3px)");
		}
		else if(fromTop>399 && fromTop<500){
			$(".global_pagesFixed").css("-webkit-filter","blur(4px)");
		}
		else if(fromTop>499){
			$(".global_pagesFixed").css("-webkit-filter","blur(5px)");
		}
		else{
			$(".global_pagesFixed").css("-webkit-filter","blur(0px)");
		}
	}
}