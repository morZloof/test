var bgElements = new bgElementsJs()
function bgElementsJs(){
	function ctor(){
		showPage()
	}
	this.ctor = ctor;
	
	function showPage(){
		$(".global_page_bgElements").show()
	}
	this.showPage = showPage;
}