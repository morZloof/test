var valert = new alertJs()
function alertJs(){
	function ctor(){
		$('.alert_btn_approve').click(closePage);
		$('.alert_x').click(closePage);
		
	}
	this.ctor = ctor;
	
	function showPage(text) {
		$('.alert_text').text(text);
		$('.global_page_alert').fadeIn();
		$('.global_pagesFixed').css('-webkit-filter','blur(5px)');
		setTimeout(closePage, 5000);
	}
	this.showPage = showPage;
	
	function closePage() {
		$('.global_page_alert').fadeOut();
		$('.global_pagesFixed').css('-webkit-filter','blur(0px)')
		
	}
}
