var notebookNav = new notebookNavJs()
function notebookNavJs(){
	function ctor(){
		showPage()
	}
	this.ctor = ctor;

	function showPage(){
        $(".global_page_notebookNav").show()
	}
	this.showPage = showPage;
}