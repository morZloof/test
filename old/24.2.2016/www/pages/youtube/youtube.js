var youtube = new youtubeJs();
function youtubeJs(){
	function ctor(){
	}
	this.ctor = ctor;
	
	function showPage(){
		global.globalHide();
		$(".global_page_youtube").show();
	}
	this.showPage = showPage;
}