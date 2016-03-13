var popup = new popupJs()
function popupJs(){
	function ctor(){
		$('.popup_btn_approve').click(closePage);
        
		$('.popup_x').click(closePage);
		
	}
	this.ctor = ctor;
	
	function showPage(text) {
		$('.popup_text').text(text);
		$('.global_page_popup').fadeIn();
		$('.global_pagesFixed').css('-webkit-filter','blur(5px)')
	}
	this.showPage = showPage;
	
	function closePage() {
		$('.global_page_popup').fadeOut();
		$('.global_pagesFixed').css('-webkit-filter','blur(0px)')
		
	}
}
