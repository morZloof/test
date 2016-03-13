var news = new newsJs()
function newsJs(){
	function ctor(){
		$(".news_body_header_menu").click(changeMenu);
		
		$(".news_body_header_menu:eq(0)").click(showAllNews);
		$(".news_body_header_menu:eq(1)").click(showAdd);
		$(".news_bodyAdd_submit").click(addNews);
		// showAdd()
	}
	this.ctor = ctor;
	
	function showPage(){
		pages.globalHide();
		getData();
		$(".news").show();
	}
	this.showPage = showPage;
	
	function getData(){
		$.ajax({
			type: 'GET',
			url: '/api/news/showNews/',
			dataType: 'text',
			success: function(data) {
				var json = JSON.parse(data);

				echoData(json);
			}
		});
	}
	function echoData(json){
		var loopLength = json.length;
		
		var clone = $(".news_body_rows:first").clone();
		$(".news_body_rows").remove()
		$(".news_body_rows_all").append(clone);	
		
		for(var i=0; i<loopLength ;i++){
			var clone = $(".news_body_rows:first").clone();
			clone.find('.news_body_rows_li:first').text(json[i].bigtext);
			clone.find('.news_body_rows_li_id').text(json[i].id);
			clone.find('.news_body_menu_li2').click(deleteNews);
			
			clone.show();
			$(".news_body_rows_all").append(clone);	
		}
	}
	function changeMenu(){
		$(".news_body_header_menu").removeClass("news_body_header_menuClick")
		$(this).addClass("news_body_header_menuClick")
	}
	
	function showAllNews(){
		getData();
		
		$(".news_bodyAdd").hide()
		$(".news_bodyAll").show()
	}
	function showAdd(){
		$(".news_bodyAll").hide()
		$(".news_bodyAdd").show()
	}
	
	function addNews(){
		var text = $(".news_bodyAdd_input").val();
		$(".news_bodyAdd_load").show();
		
		$(".news_bodyAdd_load").hide();
		$(".news_bodyAdd_ok").fadeIn();
		setTimeout(function(){
			$(".news_bodyAdd_ok").fadeOut();
		},3000)
		
		$.ajax({
			type: 'GET',
			url: '/api/news/addNews/',
			data:{
				text : text
			},
			dataType: 'text',
			success: function(data) {
				$('.news_bodyAdd_input').val("");
			}
		});
	}
	function deleteNews(){
		var theId = $(this).parent().find('.news_body_rows_li_id').text()

		$.ajax({
			type: 'GET',
			url: '/api/news/deleteNews/',
			data:{
				id : theId
			},
			dataType: 'text',
			success: function(data) {
				getData()
			}
		});
	}
}