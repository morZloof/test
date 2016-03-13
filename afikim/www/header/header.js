var header = new headerJS()
function headerJS (){
	function create(){
		$(".header_logout").click(logOut);
		getData()
	}
	this.create = create;
	
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
	this.getData = getData;
	function echoData(json){
		var loopLength = json.length
		var allWidth = 0;

		for(var i=0; i<loopLength ;i++){
			var clone = $(".header_news_row:first").clone();
			clone.text(" --- " + json[i].bigtext + " --- ");
			
			$(".header_newsHolder").append(clone);
			var width = clone.width() + 80
			
			allWidth += clone.width() + 80;
			$(".header_newsHolder").css('width','+=' + width);
		}
		
		var divWidth = $(".header_news").width()
		var divMove = allWidth - divWidth;
		if(divMove<0){
			divMove=0;
		}
		moveDiv(divMove)
	}
	var ifplus = 0;
	function moveDiv(divMove){

		if(ifplus==0){
			ifplus=1;
			$( ".header_newsHolder" ).animate({
				left: "-=" + divMove
				}, 15000, function() {
					moveDiv(divMove)
			});
		}
		else{
			ifplus=0;
			$( ".header_newsHolder" ).animate({
				left: "+=" + divMove
				}, 15000, function() {
				moveDiv(divMove)
			});
		}
	}
	function logOut(){
		window.location = "/";
		document.cookie="session = ";
		window.location = '/#tpasim';	

	}
}
	